import os.path
from contextlib import nested
from invoke import task as base_task


def task(*args, **kwargs):
    pre = list(kwargs.pop('pre', args))
    pre.append(base_task(setup_ctx))
    return base_task(pre=pre, **kwargs)


def exists(c, path):
    """
    Return True if given path exists on the current remote host. Taken from patchwork.
    """
    cmd = 'test -e "$(echo {})"'.format(path)
    return c.run(cmd, hide=True, warn=True).ok


def running_locally(c):
    return c.__class__.__module__.startswith('invoke.')


def rec_update(d1, d2):
    if not isinstance(d1, dict):
        return d2
    result = dict(d1, **d2)
    result.update({k: rec_update(v, d2.get(k, v)) for (k, v) in d1.iteritems() if isinstance(v, dict)})
    return result


def setup_ctx(c):
    """Surgically alter the context's config with config inheritance."""
    project_prefix = c.config.get('_project_home', c.config._project_prefix[:-1])
    code_root = project_prefix
    config_prefix = code_root + '/assembl/configs/'
    if not exists(c, config_prefix):
        code_root = project_prefix + '/venv/lib/python-2.7/site-packages'
        config_prefix = code_root + '/assembl/configs/'

    current = c.config._project
    current['code_root'] = code_root
    current['projectpath'] = project_prefix
    target = current.get('_extends', None)
    if not target and exists(c, 'invoke.yaml'):
        target = 'invoke.yaml'
    while target:
        if os.path.isabs(target):
            if exists(c, target):
                data = c.config._load_yaml(config_prefix + target)
            else:
                raise RuntimeError("Cannot find " + target)
        elif exists(c, config_prefix + target):
            data = c.config._load_yaml(config_prefix + target)
        elif exists(c, os.path.join(project_prefix, target)):
            data = c.config._load_yaml(os.path.join(project_prefix, target))
        else:
            raise RuntimeError("Cannot find %s in either %s or %s", (
                target, config_prefix, project_prefix))
        target = data.get('_extends', None)
        current = rec_update(data, current)
    if current is not c.config._project:
        c.config._project = current
    c.config.merge()


def venv(c):
    project_prefix = c.config.get('_project_home', c.config._project_prefix[:-1])
    activate = c.config.get('_internal', {}).get('activate', 'activate')
    return nested(c.cd(project_prefix), c.prefix('source venv/bin/' + activate))


def venv_py3(c):
    project_prefix = c.config.get('_project_home', c.config._project_prefix[:-1])
    return nested(c.cd(project_prefix), c.prefix('source venv/bin/activate && ' + 'py3'))

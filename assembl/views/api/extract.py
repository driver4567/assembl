import json
import transaction

from cornice import Service

from pyramid.security import authenticated_userid
from sqlalchemy.orm import aliased, joinedload, joinedload_all, contains_eager

from assembl.views.api import API_DISCUSSION_PREFIX
from assembl.db import DBSession
from assembl.synthesis.models import Extract
from assembl.auth.models import AgentProfile, User
from assembl.source.models import Source, Content, Post
from . import acls
from assembl.auth import (
    P_READ, P_ADD_EXTRACT, P_EDIT_EXTRACT, P_DELETE_EXTRACT)


extracts = Service(
    name='extracts',
    path=API_DISCUSSION_PREFIX + '/extracts',
    description="An extract from Content that is an expression of an Idea",
    renderer='json', acl=acls
)

extract = Service(
    name='extract',
    path=API_DISCUSSION_PREFIX + '/extracts/{id}',
    description="Manipulate a single extract",
    acl=acls
)


@extract.get()  # permission=P_READ
def get_extract(request):
    extract_id = request.matchdict['id']
    extract = DBSession.query(Extract).get(int(extract_id))

    return extract.serializable()


@extracts.get()  # permission=P_READ
def get_extracts(request):
    discussion_id = int(request.matchdict['discussion_id'])

    all_extracts = DBSession.query(Extract).join(
        Content,
        Source
    ).filter(
        Source.discussion_id==discussion_id,
        Content.source_id==Source.id
    )
    all_extracts = all_extracts.options(joinedload_all(Extract.source, Content.post, Post.creator, AgentProfile.user))
    all_extracts = all_extracts.options(joinedload_all(Extract.creator, User.profile))
    serializable_extracts = [
        extract.serializable() for extract in all_extracts
    ]

    return serializable_extracts


@extracts.post()  # permission=P_ADD_EXTRACT
def post_extract(request):
    """
    Create a new extract.
    """
    extract_data = json.loads(request.body)
    user_id = authenticated_userid(request)
    
    post_id = extract_data.get('idPost')
    
    with transaction.manager:
        post = DBSession.query(Post).get(int(post_id))
        if not post:
            raise HTTPNotFound("Post with id '%s' not found." % post_id)
        extract_body = extract_data.get('text', '')
        new_extract = Extract(
            creator_id=user_id,
            owner_id=user_id,
            body=extract_body,
            source_id=post.content.id
        )

        DBSession.add(new_extract)

    new_extract = DBSession.merge(new_extract)

    return {'ok': True, 'id': new_extract.id}


@extract.put()  # permission=P_EDIT_EXTRACT
def put_extract(request):
    """
    Updating an Extract
    """
    extract_id = request.matchdict['id']
    user_id = authenticated_userid(request)

    updated_extract_data = json.loads(request.body)
    extract = DBSession.query(Extract).get(int(extract_id))

    with transaction.manager:
        extract.owner_id = user_id or extract.owner_id
        extract.order = updated_extract_data.get('order', extract.order)
        extract.idea_id = updated_extract_data['idIdea']

        DBSession.add(extract)

    return {'ok': True}


@extract.delete()  # permission=P_DELETE_EXTRACT
def delete_extract(request):
    extract_id = request.matchdict['id']
    extract = DBSession.query(Extract).get(int(extract_id))

    if not extract:
        return {'ok': False}

    with transaction.manager:
        DBSession.delete(extract)

    return {'ok': True}

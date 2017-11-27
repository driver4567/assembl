import pytest
from sqlalchemy import inspect


@pytest.fixture(scope="function")
def discussion(request, test_session, default_preferences):
    """An empty Discussion fixture with default preferences"""
    from assembl.models import Discussion, LangString
    with test_session.no_autoflush:
        d = Discussion(
            topic=u"Jack Layton", slug="jacklayton2",
            subscribe_to_notifications_on_signup=False,
            creator=None,
            session=test_session)
        d.discussion_locales = ['en', 'fr', 'de']
        d.legal_notice = LangString.create(
            u"We need to input the optical HDD sensor!", "en")
        tac = LangString.create(
            u"You can't quantify the driver without quantifying the 1080p JSON protocol!", "en")
        tac.add_value(
            u"Vous ne pouvez pas mesurer le driver sans mesurer le protocole JSON en 1080p", u"fr")
        d.terms_and_conditions = tac
        test_session.add(d)
    test_session.flush()

    def fin():
        print "finalizer discussion"
        discussion = d
        if inspect(discussion).detached:
            # How did this happen?
            discussion = test_session.query(Discussion).get(d.id)
        test_session.delete(discussion.table_of_contents)
        test_session.delete(discussion.root_idea)
        test_session.delete(discussion.next_synthesis)
        preferences = discussion.preferences
        discussion.preferences = None
        discussion.preferences_id = None
        for ut in discussion.user_templates:
            for ns in ut.notification_subscriptions:
                ns.delete()
            ut.delete()
        test_session.delete(preferences)
        test_session.delete(discussion)
        test_session.flush()
    request.addfinalizer(fin)
    return d


@pytest.fixture(scope="function")
def discussion2(request, test_session):
    """An non-empty Discussion fixture with default preferences"""
    from assembl.models import Discussion
    d = Discussion(
        topic=u"Second discussion", slug="testdiscussion2", creator=None)
    test_session.add(d)
    test_session.add(d.next_synthesis)
    test_session.add(d.root_idea)
    test_session.add(d.table_of_contents)
    test_session.flush()

    def fin():
        print "finalizer discussion2"
        test_session.delete(d.table_of_contents)
        test_session.delete(d.root_idea)
        test_session.delete(d.next_synthesis)
        for ut in d.user_templates:
            for ns in ut.notification_subscriptions:
                ns.delete()
            ut.delete()
        preferences = d.preferences
        d.preferences = None
        test_session.delete(preferences)
        test_session.delete(d)
        test_session.flush()
    request.addfinalizer(fin)
    return d


@pytest.fixture(scope="function")
def discussion_with_lang_prefs(request, test_session, discussion):
    """An empty Discussion fixture with locale preferences"""
    discussion.discussion_locales = ['en', 'fr', 'ja']
    test_session.commit()

    return discussion

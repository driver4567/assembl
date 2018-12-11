import json

from graphql_relay.node.node import from_global_id

from assembl import models
from assembl.graphql.schema import Schema as schema

def test_update_preferences(test_app, discussion, graphql_registry, graphql_request):
    import pdb; pdb.set_trace()
    response = schema.execute(
        graphql_registry['updateDiscussionPreference'],
        context_value=graphql_request,
        variable_values={"mandatoryLegalContentsValidation": True}
    )
    assert discussion.preferences['mandatory_legal_contents_validation']
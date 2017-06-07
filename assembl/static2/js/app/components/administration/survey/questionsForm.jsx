import React from 'react';
import { gql, withApollo } from 'react-apollo';
import { FormGroup } from 'react-bootstrap';

import QuestionTitle from './questionTitle';

const GetThematics = gql`
{
  thematics(identifier:"survey") {
    id,
    titleEntries {
      localeCode,
      value
    },
    imgUrl,
    video {
      titleEntries {
        localeCode,
        value
      },
      descriptionEntries {
        localeCode,
        value
      },
      htmlCode
    },
    questions {
      titleEntries {
        localeCode,
        value
      }
    }
  }
}
`;

const QuestionsForm = ({ client, thematicId, lang }) => {
  const thematicsData = client.readQuery({ query: GetThematics });

  const thematics = thematicsData.thematics;
  const thematic = thematics.find((t) => {
    return String(t.id) === thematicId;
  });

  const thematicIndex = thematics.findIndex((t) => {
    return String(t.id) === thematicId;
  });

  const questions = thematic ? thematic.questions : [];

  const addQuestion = () => {
    if (thematicIndex !== -1) {
      thematicsData.thematics[thematicIndex].questions.push({
        titleEntries: [],
        __typename: 'Question'
      });

      client.writeQuery({
        query: GetThematics,
        data: thematicsData
      });
    }
  };

  return (
    <div className={thematic ? 'form-container' : 'hidden'}>
      <div className="margin-xl">
        {questions.map((question, index) => {
          return (
            <FormGroup key={index}>
              <QuestionTitle tIndex={thematicIndex} qIndex={index} titleEntries={question.titleEntries} selectedLocale={lang} />
            </FormGroup>
          );
        })}
        <div onClick={addQuestion} className="plus margin-l">+</div>
      </div>
    </div>
  );
};

export default withApollo(QuestionsForm);
import { React, useState, useEffect } from 'react';
import { apiBaseUrl } from './utils/links';
import AnimalCard from './utils/AnimalCard';
import { useNavigate } from 'react-router-dom';

export default function MatchTest() {
  const [animals, setAnimals] = useState([]);
  const [mappedAnimals, setMappedAnimals] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMatchTestFinished, setMatchTestFinished] = useState(false);
  const navigate = useNavigate();
  const questions = [
    {
      text: 'Você prefere passar seu tempo livre ao ar livre ou dentro de casa?',
      image: 'https://amadote.blob.core.windows.net/amadote/quiz1.png',
      answers: [
        {
          text: 'Ar livre',
          personalities: [
            'Brincalhão',
            'Independente',
            'Curioso',
            'Aventureiro',
            'Ama o ar livre',
            'Bom com crianças',
          ],
        },
        {
          text: 'Dentro de casa',
          personalities: [
            'Amoroso',
            'Preguiçoso',
            'Assustado',
            'Protetor',
            'Teimoso',
            'Dócil',
            'Sossegado',
            'Comilão',
          ],
        },
      ],
    },
    {
      text: 'Você gosta de passar tempo com amigos e familiares ou prefere ficar sozinho?',
      image: 'https://amadote.blob.core.windows.net/amadote/quiz2.png',
      answers: [
        {
          text: 'Amigos e familiares',
          personalities: [
            'Brincalhão',
            'Independente',
            'Curioso',
            'Aventureiro',
            'Dócil',
            'Ama o ar livre',
            'Comilão',
            'Bom com crianças',
          ],
        },
        {
          text: 'Ficar sozinho',
          personalities: ['Amoroso', 'Preguiçoso', 'Assustado', 'Protetor', 'Teimoso', 'Sossegado'],
        },
      ],
    },
    {
      text: 'Como você reage a situações desconhecidas?',
      image: 'https://amadote.blob.core.windows.net/amadote/quiz3.png',
      answers: [
        {
          text: 'Fico empolgado e curioso',
          personalities: [
            'Brincalhão',
            'Amoroso',
            'Curioso',
            'Aventureiro',
            'Teimoso',
            'Ama o ar livre',
            'Comilão',
          ],
        },
        {
          text: 'Fico cauteloso e observador',
          personalities: [
            'Independente',
            'Preguiçoso',
            'Assustado',
            'Protetor',
            'Dócil',
            'Sossegado',
            'Bom com crianças',
          ],
        },
      ],
    },
    {
      text: 'Qual é a sua atitude em relação a comida?',
      image: 'https://amadote.blob.core.windows.net/amadote/quiz4.png',
      answers: [
        {
          text: 'Experimentar',
          personalities: [
            'Brincalhão',
            'Independente',
            'Curioso',
            'Aventureiro',
            'Ama o ar livre',
            'Comilão',
            'Teimoso',
          ],
        },
        {
          text: 'Seletivo',
          personalities: [
            'Amoroso',
            'Preguiçoso',
            'Assustado',
            'Protetor',
            'Teimoso',
            'Dócil',
            'Sossegado',
            'Bom com crianças',
          ],
        },
      ],
    },
    {
      text: 'Você prefere atividades tranquilas e calmas ou atividades mais agitadas e movimentadas?',
      image: 'https://amadote.blob.core.windows.net/amadote/quiz5.png',
      answers: [
        {
          text: 'Calmas',
          personalities: [
            'Independente',
            'Amoroso',
            'Preguiçoso',
            'Assustado',
            'Protetor',
            'Teimoso',
            'Dócil',
            'Sossegado',
            'Comilão',
          ],
        },
        {
          text: 'Movimentadas',
          personalities: [
            'Brincalhão',
            'Curioso',
            'Aventureiro',
            'Ama o ar livre',
            'Bom com crianças',
          ],
        },
      ],
    },
  ];
  const [personalitiesScores, setPersonalitiesScores] = useState({
    Brincalhão: 0,
    Independente: 0,
    Amoroso: 0,
    Curioso: 0,
    Preguiçoso: 0,
    Aventureiro: 0,
    Assustado: 0,
    Protetor: 0,
    Teimoso: 0,
    Dócil: 0,
    Sossegado: 0,
    'Ama o ar livre': 0,
    Comilão: 0,
    'Bom com crianças': 0,
  });

  useEffect(() => {
    async function getAnimals() {
      const response = await fetch(`${apiBaseUrl}/api/animal/`);
      const jsonResponse = (await response?.json()) ?? [];

      setAnimals(jsonResponse);
    }

    getAnimals();
  }, []);

  function handleAnswerSelect(personalities) {
    const newScores = {};
    personalities.forEach(
      (personality) => (newScores[personality] = personalitiesScores[personality] + 1),
    );

    setPersonalitiesScores({ ...personalitiesScores, ...newScores });

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      return;
    }

    const mappedAnimals = sortByMatch(animals);

    setMappedAnimals(mappedAnimals);
    setMatchTestFinished(true);
  }

  function sortByMatch(animals) {
    return animals?.sort((a, b) => {
      const highestScorePersonalityA = a.personality.reduce((acc, pers) =>
        personalitiesScores[acc] > personalitiesScores[pers] ? acc : pers,
      );
      const highestScorePersonalityB = b.personality.reduce((acc, pers) =>
        personalitiesScores[acc] > personalitiesScores[pers] ? acc : pers,
      );

      if (
        personalitiesScores[highestScorePersonalityA] ===
        personalitiesScores[highestScorePersonalityB]
      ) {
        const countA = a.personality.filter(
          (pers) => personalitiesScores[pers] === personalitiesScores[highestScorePersonalityA],
        ).length;
        const countB = b.personality.filter(
          (pers) => personalitiesScores[pers] === personalitiesScores[highestScorePersonalityB],
        ).length;

        return countB - countA;
      }

      return (
        personalitiesScores[highestScorePersonalityB] -
        personalitiesScores[highestScorePersonalityA]
      );
    });
  }

  return (
    <div className="matchBody">
      <div className="matchHeader">
        <h1>Teste de personalidade para descobrir seu pet ideal</h1>
        <p>
          Responda algumas perguntas e nós iremos identificar os animais mais compatíveis com o seu
          perfil!
        </p>
      </div>
      {!isMatchTestFinished && (
        <div className="matchQuestion">
          <div className="matchQuestionText">
            <p style={{ color: '#F9A03F' }}>
              Questão&nbsp;
              {(currentQuestionIndex + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })}.
            </p>
            <p style={{ color: '#1C3144' }}>{questions[currentQuestionIndex]?.text}</p>
          </div>
          <img className="matchImage" src={questions[currentQuestionIndex]?.image} alt="Quiz" />
          <div className="matchButtonBox">
            {questions[currentQuestionIndex]?.answers.map((answer) => (
              <button
                className="matchButton"
                onClick={() => handleAnswerSelect(answer?.personalities)}
                key={answer?.text}
              >
                {answer?.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {isMatchTestFinished && (
        <>
          <button
            className="matchButton"
            style={{ width: 'fit-content', alignSelf: 'center', marginBottom: '30px' }}
            onClick={() => {
              setCurrentQuestionIndex(0);
              setMatchTestFinished(false);
            }}
          >
            Refazer teste
          </button>
          <div className="animalsList" style={{ width: '80%', alignSelf: 'center' }}>
            {mappedAnimals?.map((animal) => (
              <AnimalCard
                animalInfo={animal}
                key={animal._id}
                buttonOptions={{
                  buttonText: 'Ver mais',
                  buttonFunction: () => navigate(`/animais/${animal._id}`),
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

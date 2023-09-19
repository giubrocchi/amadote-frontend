import React from 'react';

export default function Faq() {
  const faqData = [
    {
      question: 'Quem pode realizar uma adoção?',
      answer: 'Qualquer pessoa, plenamente capaz, maior de 18 anos, mediante assinatura do contrato de adoção.',
    },
    {
      question: 'Preciso pagar alguma coisa? ',
      answer: 'Nadinha. Nós não cobramos taxa de adoção. Mas é claro que ficamos felizes quando ajudam nosso trabalho a continuar.',
    },
    {
      question: 'O que é adoção responsável?',
      answer: 'É o processo que esclarece quem deseja adotar, mas não sabe exatamente todas as suas responabilidades com aquela vida. Geralmente, as pessoas consideram ração, casa e carinho suficientes, mas ter um amigo de quatro patas vai muito além disso.'
    },
  ];

  const faqItems = faqData.map((item, index) => (
    <div className="faqItem" key={index}>
      <h2 className="faqQuestion">{item.question}</h2>
      <p className="faqAnswer">{item.answer}</p>
    </div>
  ));

  return (
    <div className="faqBody">
      <h1 id="PergTitle">Perguntas Frequentes</h1>
      <div className="faqList">{faqItems}</div>
    </div>
  );
}

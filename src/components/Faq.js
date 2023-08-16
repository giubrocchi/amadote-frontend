import React from 'react';

export default function Faq() {
  const faqData = [
    {
      question: 'Qual é o processo de adoção?',
      answer: 'O processo de adoção é.....'
    },
    {
      question: 'Como faço para adotar um animal?',
      answer: 'Para adotar um animal é necessário... ...'
    },
  ];

  const faqItems = faqData.map((item, index) => (
    <div className='faqItem' key={index}>
      <h2 className='faqQuestion'>{item.question}</h2>
      <p className='faqAnswer'>{item.answer}</p>
    </div>
  ));

  return (
    <div className='faqBody'>
      <h1 id="PergTitle">Perguntas Frequentes</h1>
      <div className='faqList'>
        {faqItems}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../utils/links';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [totalAdoptions, setTotalAdoptions] = useState(0);
  const [adoptionsAmadote, setAdoptionsAmadote] = useState(0);
  const [adoptionsOtherMeans, setAdoptionsOtherMeans] = useState(0);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalAdoptionsAverage, setTotalAdoptionsAverage] = useState(0);
  const [amadoteAdoptionsAverage, setamadoteAdoptionsAverage] = useState(0);
  const [yearRegistered, setYearRegistered] = useState([]);
  const [yearRegisteredLabels, setYearRegisteredLabels] = useState([]);
  const [yearAdoptions, setYearAdoptions] = useState([]);
  const [yearAdoptionsAmadote, setYearAdoptionsAmadote] = useState([]);
  const [yearAdoptionsLabels, setYearAdoptionsLabels] = useState([]);
  const [adoptionType, setAdoptionType] = useState('total');
  const currentDate = new Date();
  const [dateToCompare, setDateToCompare] = useState({
    label: '7 dias',
    value: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7),
  });
  const dateOptions = [
    {
      label: '7 dias',
      value: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7),
    },
    {
      label: '15 dias',
      value: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 15,
      ),
    },
    {
      label: '30 dias',
      value: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()),
    },
    {
      label: '6 meses',
      value: new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate()),
    },
    {
      label: '1 ano',
      value: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()),
    },
    {
      label: '5 anos',
      value: new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), currentDate.getDate()),
    },
  ];

  useEffect(() => {
    async function getAdoptionsData(id) {
      const adoptedAnimals = await fetch(`${apiBaseUrl}/api/adoptionProposal/getDoneOng`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _idAdoptionCenter: id }),
      });
      const jsonAdoptedAnimals = (await adoptedAnimals?.json()) ?? [];

      const allAnimals = await fetch(`${apiBaseUrl}/api/animal/getAllOng`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _idAdoptionCenter: id }),
      });
      const jsonAllAnimals = (await allAnimals?.json()) ?? [];

      parseData(jsonAdoptedAnimals, jsonAllAnimals);
    }

    function parseData(adopted, all) {
      const adoptedAnimals = adopted?.map((row) => {
        return { ...row, adoptedAt: new Date(row?.adoptedAt) };
      });
      const allAnimals = all?.map((row) => {
        return { ...row, createdAt: new Date(row?.createdAt) };
      });

      const total = adoptedAnimals?.filter(
        ({ adoptedAt }) => adoptedAt > dateToCompare.value,
      ).length;
      const totalAmadote = adoptedAnimals?.filter(
        ({ adoptedAt, status }) => adoptedAt > dateToCompare.value && status === 'adopted',
      ).length;
      const totalOtherMeans = adoptedAnimals?.filter(
        ({ adoptedAt, status }) =>
          adoptedAt > dateToCompare.value && status === 'adoptedByOtherMeans',
      ).length;
      const currentDate = new Date();
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate(),
      );
      const registered = allAnimals?.filter(({ createdAt }) => createdAt > lastMonth).length;
      const months = [
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez',
      ];

      const mappedAdopted = adoptedAnimals?.reduce((previous, { adoptedAt }) => {
        var key = months[adoptedAt?.getMonth()] + '/' + adoptedAt?.getFullYear();
        previous[key] = (previous[key] || 0) + 1;

        return previous;
      }, {});
      const values = Object.values(mappedAdopted);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const oldestDate = allAnimals?.reduce(
        (oldest, current) => {
          return current.createdAt < oldest.createdAt ? current : oldest;
        },
        { createdAt: new Date() },
      );
      const monthsDifference =
        (currentDate.getFullYear() - oldestDate?.createdAt.getFullYear()) * 12 +
        currentDate.getMonth() -
        oldestDate?.createdAt.getMonth();
      const averageAdopted = Math.round((sum / monthsDifference || 0) * 100) / 100;

      const mappedAdoptedAmadote = adoptedAnimals?.reduce((previous, { adoptedAt, status }) => {
        if (status !== 'adopted') return previous;

        var key = months[adoptedAt?.getMonth()] + '/' + adoptedAt?.getFullYear();
        previous[key] = (previous[key] || 0) + 1;

        return previous;
      }, {});
      const valuesAmadote = Object.values(mappedAdoptedAmadote);
      const sumAmadote = valuesAmadote.reduce((acc, val) => acc + val, 0);
      const averageAdoptedAmadote = Math.round((sumAmadote / monthsDifference || 0) * 100) / 100;

      const lastYear = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
      const monthlyYearPairs = [];
      for (let i = 11; i >= 0; i--) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();

        monthlyYearPairs.push(`${months[month]}/${year}`);
      }
      const monthlyRegisteredCount = allAnimals.reduce((previous, { createdAt }) => {
        if (createdAt < lastYear) return previous;

        var key = months[createdAt?.getMonth()] + '/' + createdAt?.getFullYear();
        previous[key] = (previous[key] || 0) + 1;

        return previous;
      }, {});
      const monthlyRegistered = monthlyYearPairs.map((key) => monthlyRegisteredCount[key] || 0);

      const monthlyAdoptedCount = adoptedAnimals.reduce((previous, { adoptedAt }) => {
        if (adoptedAt < lastYear) return previous;

        var key = months[adoptedAt?.getMonth()] + '/' + adoptedAt?.getFullYear();
        previous[key] = (previous[key] || 0) + 1;

        return previous;
      }, {});
      const monthlyAdopted = monthlyYearPairs.map((key) => monthlyAdoptedCount[key] || 0);

      const monthlyAdoptedAmadoteCount = adoptedAnimals.reduce(
        (previous, { adoptedAt, status }) => {
          if (adoptedAt < lastYear || status !== 'adopted') return previous;

          var key = months[adoptedAt?.getMonth()] + '/' + adoptedAt?.getFullYear();
          previous[key] = (previous[key] || 0) + 1;

          return previous;
        },
        {},
      );
      const monthlyAdoptedAmadote = monthlyYearPairs.map(
        (key) => monthlyAdoptedAmadoteCount[key] || 0,
      );

      setTotalAdoptions(total);
      setAdoptionsAmadote(totalAmadote);
      setAdoptionsOtherMeans(totalOtherMeans);
      setTotalRegistered(registered);
      setTotalAdoptionsAverage(averageAdopted);
      setamadoteAdoptionsAverage(averageAdoptedAmadote);
      setYearRegistered(monthlyRegistered);
      setYearRegisteredLabels(monthlyYearPairs);
      setYearAdoptions(monthlyAdopted);
      setYearAdoptionsAmadote(monthlyAdoptedAmadote);
      setYearAdoptionsLabels(monthlyYearPairs);
    }

    const id = localStorage.getItem('loggedId');

    getAdoptionsData(id);
  }, [dateToCompare.value]);

  function handleDateChange(newDate) {
    setDateToCompare(newDate);
  }

  return (
    <div className="dashboardBody">
      <h1 style={{ alignSelf: 'center' }}>Dashboard</h1>
      <div className="dashboardData">
        <h1
          className="dashboardRowTile"
          style={{ marginTop: 20, display: 'inline-block', lineHeight: '30px' }}
        >
          Número de adoções nos últimos&nbsp;
          <Select
            name="date"
            options={dateOptions}
            value={dateToCompare ?? dateOptions[0]}
            onChange={(value) => handleDateChange(value)}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: 'rgba(63, 137, 197, 0.25)',
                marginBottom: '0px',
                fontSize: '18px',
                color: '#1C3144',
                borderRadius: '10px',
                border: '1px solid #3F88C5',
                outline: 'none',
                lineHeight: '18px',
              }),
              container: (baseStyles) => ({ ...baseStyles, display: 'inline-block' }),
              option: (baseStyles) => ({ ...baseStyles, fontSize: '18px' }),
            }}
          />
        </h1>
        <div className="dashboardRow">
          <div className="dashboardBox">
            <h3 className="dashboardBoxTitle">Total</h3>
            <p className="dashboardBoxData">{totalAdoptions}</p>
          </div>
          <div className="dashboardBox">
            <h3 className="dashboardBoxTitle">Pelo Amadote</h3>
            <p className="dashboardBoxData">{adoptionsAmadote}</p>
          </div>
          <div className="dashboardBox">
            <h3 className="dashboardBoxTitle">Por outros meios</h3>
            <p className="dashboardBoxData">{adoptionsOtherMeans}</p>
          </div>
        </div>
        <h1 className="dashboardRowTile">Outros dados</h1>
        <div className="dashboardRow">
          <div className="dashboardBox">
            <h3 className="dashboardBoxTitle">Animais cadastrados nos últimos 30 dias</h3>
            <p className="dashboardBoxData">{totalRegistered}</p>
          </div>
          <div className="dashboardBox">
            <h3 className="dashboardBoxTitle">Média de adoções totais por mês</h3>
            <p className="dashboardBoxData">{totalAdoptionsAverage}</p>
          </div>
          <div className="dashboardBox">
            <h3 className="dashboardBoxTitle">Média de adoções pelo Amadote por mês</h3>
            <p className="dashboardBoxData">{amadoteAdoptionsAverage}</p>
          </div>
        </div>
        <div className="dashboardGraphRow" style={{ marginTop: 30 }}>
          <div className="dashboardGraph">
            <button style={{ visibility: 'hidden' }}></button>
            <Line
              data={{
                labels: yearRegisteredLabels,
                datasets: [
                  {
                    label: 'Animais',
                    data: yearRegistered,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Número de animais registrados' },
                },
              }}
            />
          </div>
          <div className="dashboardGraph">
            <div className="graphButtonContainer">
              <button
                onClick={() => setAdoptionType('total')}
                className={`graphButton ${adoptionType === 'total' ? 'graphButtonSelected' : ''}`}
              >
                Total
              </button>
              <button
                onClick={() => setAdoptionType('amadote')}
                className={`graphButton ${adoptionType === 'amadote' ? 'graphButtonSelected' : ''}`}
              >
                Amadote
              </button>
            </div>
            <div style={{ height: '-webkit-fill-available' }}>
              <Line
                data={{
                  labels: yearAdoptionsLabels,
                  datasets: [
                    {
                      label: 'Animais',
                      data: adoptionType === 'total' ? yearAdoptions : yearAdoptionsAmadote,
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } },
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Número de adoções' },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

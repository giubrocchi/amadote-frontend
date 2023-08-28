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
  const [yearAdoptionsLabels, setYearAdoptionsLabels] = useState([]);

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

      const currentDate = new Date();
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate(),
      );
      const total = adoptedAnimals?.filter(({ adoptedAt }) => adoptedAt > lastMonth).length;
      const totalAmadote = adoptedAnimals?.filter(
        ({ adoptedAt, status }) => adoptedAt > lastMonth && status === 'adopted',
      ).length;
      const totalOtherMeans = adoptedAnimals?.filter(
        ({ adoptedAt, status }) => adoptedAt > lastMonth && status === 'adoptedByOtherMeans',
      ).length;
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

      setTotalAdoptions(total);
      setAdoptionsAmadote(totalAmadote);
      setAdoptionsOtherMeans(totalOtherMeans);
      setTotalRegistered(registered);
      setTotalAdoptionsAverage(averageAdopted);
      setamadoteAdoptionsAverage(averageAdoptedAmadote);
      setYearRegistered(monthlyRegistered);
      setYearRegisteredLabels(monthlyYearPairs);
      setYearAdoptions(monthlyAdopted);
      setYearAdoptionsLabels(monthlyYearPairs);
    }

    const id = localStorage.getItem('loggedId');

    getAdoptionsData(id);
  }, []);

  return (
    <div className="dashboardBody">
      <h1 style={{ alignSelf: 'center' }}>Dashboard</h1>
      <div className="dashboardData">
        <h1 className="dashboardRowTile">Número de adoções nos últimos 30 dias</h1>
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
        <div className="dashboardRow" style={{ marginTop: 30 }}>
          <div className="dashboardBox">
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
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Número de animais registrados' },
                },
              }}
            />
          </div>
          <div className="dashboardBox">
            <Line
              data={{
                labels: yearAdoptionsLabels,
                datasets: [
                  {
                    label: 'Animais',
                    data: yearAdoptions,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                ],
              }}
              options={{
                responsive: true,
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
  );
}

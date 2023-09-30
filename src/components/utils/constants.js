const species = [
  'Cachorro',
  'Gato',
  'Canário',
  'Coelho',
  'Calopsita',
  'Camundongo',
  'Chinchila',
  'Hamster',
  'Peixe',
  'Periquito',
  'Papagaio',
  'Porquinho da índia',
  'Tartaruga',
  'Jabuti',
  'Outro',
];
const sizes = ['Pequeno', 'Médio', 'Grande'];
const sex = ['F', 'M'];
const personalities = [
  'Brincalhão',
  'Independente',
  'Amoroso',
  'Curioso',
  'Preguiçoso',
  'Aventureiro',
  'Assustado',
  'Protetor',
  'Teimoso',
  'Dócil',
  'Sossegado',
  'Ama o ar livre',
  'Comilão',
  'Bom com crianças',
];
const houseSituationOptions = [
  { label: 'Casa alugada', value: 'rentedHouse' },
  { label: 'Casa própria', value: 'ownHouse' },
  { label: 'Sobrado', value: 'townhouse' },
  { label: 'Apartamento alugado', value: 'rentedApartment' },
  { label: 'Apartamento próprio', value: 'ownApartment' },
  { label: 'Janelas com telas', value: 'meshedWindows' },
  { label: 'Sacada com tela', value: 'meshedBalcony' },
  { label: 'Quintal aberto', value: 'openedBackyard' },
  { label: 'Quintal todo cercado com portão', value: 'fencedBackyard' },
  { label: 'Há risco de fuga', value: 'scapePossibility' },
  { label: 'Local reservado para o animal', value: 'reservedLocal' },
];
const postCategories = [
  { value: 'responsibleAdoption', label: 'Adoção responsável' },
  { value: 'animalCare', label: 'Cuidados com o animal' },
  { value: 'shelterSupport', label: 'Apoio a abrigos' },
  { value: 'curiosities', label: 'Curiosidades' },
];

export { species, sizes, sex, personalities, houseSituationOptions, postCategories };

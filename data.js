/* Данные пака: шесть скинов и сцена с санями.
   Этот же набор лежит в skins.json — его можно скачать из интерфейса. */

export const SKINS = [
  {
    id: 'ded-moroz',
    kind: 'ded',
    eyebrow: 'Скин 01',
    name: 'Дед Мороз',
    role: 'Главный герой',
    desc: 'Тяжёлая шуба с меховой опушкой, борода до пояса и посох со звездой. Собирается из базовой одежды и нескольких аксессуаров, а читается даже на дальнем плане.',
    colors: {
      coat: '#B0122B', trim: '#F7F3EA', skin: '#F0C9A6', pants: '#7E0E20',
      boot: '#2A1B15', bootTrim: '#F7F3EA', gold: '#E6B45C', hair: '#E8E3D6',
      accent: '#E6B45C', belt: '#14342B', glove: '#F7F3EA'
    },
    size: 1.06,
    torsoW: 2.05,
    torsoD: 1.15,
    avatar: 'R15 · рост 100% · ширина 25%',
    animation: 'Cartoony',
    budget: 'средний',
    tags: ['#дедмороз', '#шуба', '#посох', '#валенки'],
    search: ['santa coat', 'white fur hat', 'long white beard', 'star staff', 'felt boots'],
    palette: [
      ['Шуба', '#B0122B'], ['Мех', '#F7F3EA'], ['Пояс', '#14342B'],
      ['Золото', '#E6B45C'], ['Кожа', '#F0C9A6']
    ]
  },
  {
    id: 'snegurochka',
    kind: 'sneg',
    eyebrow: 'Скин 02',
    name: 'Снегурочка',
    role: 'Дуэт с Дедом',
    desc: 'Ледяная шуба, серебряный кокошник и длинная коса. В паре с Дедом Морозом получается готовый дуэт для новогоднего ивента или ролика.',
    colors: {
      coat: '#BFE4FF', trim: '#F4FAFF', skin: '#F6D8C4', pants: '#A9D4F5',
      boot: '#EAF6FF', gold: '#C9D6E3', hair: '#F0DFA8', accent: '#8FD3FF',
      belt: '#DDE7F2', glove: '#F4FAFF'
    },
    size: 0.97,
    torsoW: 1.86,
    torsoD: 1.0,
    avatar: 'R15 · рост 95% · ширина 0%',
    animation: 'Stylish',
    budget: 'средний',
    tags: ['#снегурочка', '#кокошник', '#коса', '#лёд'],
    search: ['ice blue coat', 'kokoshnik', 'long blonde braid', 'ice staff', 'ice skates'],
    palette: [
      ['Шуба', '#BFE4FF'], ['Мех', '#F4FAFF'], ['Кокошник', '#C9D6E3'],
      ['Лёд', '#8FD3FF'], ['Коса', '#F0DFA8']
    ]
  },
  {
    id: 'rudolph',
    kind: 'rudolph',
    eyebrow: 'Скин 03',
    name: 'Рудольф',
    role: 'Олень-разведчик',
    desc: 'Двуногое оленье тело, ветвистые рога и светящийся нос. Вязаный шарф и упряжь с бубенцами добавляют зимнего настроения.',
    colors: {
      coat: '#7A4A2B', trim: '#F0E2C8', skin: '#7A4A2B', pants: '#5E371F',
      boot: '#33200F', gold: '#D9A653', hair: '#B08A5E', accent: '#E33B2E',
      belt: '#4A2C18', glove: '#7A4A2B', scarf: '#B3323C'
    },
    size: 1.0,
    torsoW: 1.95,
    torsoD: 1.05,
    avatar: 'R15 · рост 100% · ширина 0%',
    animation: 'Toy',
    budget: 'бюджет',
    tags: ['#олень', '#рога', '#светящийсянос', '#упряжь'],
    search: ['reindeer antlers', 'reindeer costume', 'glowing nose', 'knitted scarf', 'harness bells'],
    palette: [
      ['Мех', '#7A4A2B'], ['Морда', '#F0E2C8'], ['Рога', '#B08A5E'],
      ['Нос', '#E33B2E'], ['Шарф', '#B3323C']
    ]
  },
  {
    id: 'north-reindeer',
    kind: 'north',
    eyebrow: 'Скин 04',
    name: 'Северный олень',
    role: 'Тяжёлая упряжка',
    desc: 'Крупный олень в сбруе: попона, бубенцы и гирлянда на рогах. Самый «дорогой» образ пака по числу аксессуаров — хорош вторым номером в кадре с санями.',
    colors: {
      coat: '#6E6257', trim: '#D8CBB6', skin: '#6E6257', pants: '#4A4038',
      boot: '#2A241E', gold: '#E6B45C', hair: '#C7B9A1', accent: '#FFD79A',
      belt: '#3B2F26', glove: '#6E6257', scarf: '#A5122A'
    },
    size: 1.1,
    torsoW: 2.2,
    torsoD: 1.2,
    avatar: 'R15 · рост 100% · ширина 30%',
    animation: 'Elder',
    budget: 'премиум',
    tags: ['#северныйолень', '#упряжь', '#бубенцы', '#гирлянда'],
    search: ['reindeer antlers', 'horse harness', 'saddle blanket', 'fairy lights', 'fur cape'],
    palette: [
      ['Шерсть', '#6E6257'], ['Морда', '#D8CBB6'], ['Попона', '#A5122A'],
      ['Упряжь', '#E6B45C'], ['Гирлянда', '#FFD79A']
    ]
  },
  {
    id: 'elf-postman',
    kind: 'elf',
    eyebrow: 'Скин 05',
    name: 'Эльф-почтальон',
    role: 'Почта Деда Мороза',
    desc: 'Зелёный мундир, колпак с помпоном и сумка с письмами. Самый простой в сборке: почти всё закрывается базовым костюмом и парой аксессуаров.',
    colors: {
      coat: '#1F5C3A', trim: '#F7F3EA', skin: '#F0C9A6', pants: '#16452C',
      boot: '#2A1B15', gold: '#E6B45C', hair: '#C98B4B', accent: '#C0172B',
      belt: '#2A1B15', glove: '#F7F3EA', scarf: '#C0172B'
    },
    size: 0.93,
    torsoW: 1.8,
    torsoD: 0.95,
    avatar: 'R15 · рост 90% · ширина 0%',
    animation: 'Toy',
    budget: 'бюджет',
    tags: ['#эльф', '#колпак', '#сумка', '#письма'],
    search: ['elf costume', 'pointed ears', 'elf hat pompom', 'mail satchel', 'striped scarf'],
    palette: [
      ['Мундир', '#1F5C3A'], ['Отделка', '#F7F3EA'], ['Пояс', '#2A1B15'],
      ['Золото', '#E6B45C'], ['Письма', '#CFE7FF']
    ]
  },
  {
    id: 'snowman',
    kind: 'snowman',
    eyebrow: 'Скин 06',
    name: 'Снеговик-помощник',
    role: 'Маскот пака',
    desc: 'Три снежных шара, ведро на голове и морковка вместо носа. Делается почти без покупок: тело — костюм, остальное — мелкие аксессуары.',
    colors: {
      coat: '#F2F7FF', trim: '#FFFFFF', skin: '#F2F7FF', pants: '#DCE9F7',
      boot: '#9FB4C9', gold: '#E6B45C', hair: '#FFFFFF', accent: '#F97316',
      belt: '#C0172B', glove: '#F2F7FF'
    },
    size: 1.0,
    torsoW: 1.6,
    torsoD: 1.6,
    avatar: 'R15 · рост 100% · ширина 10%',
    animation: 'Toy',
    budget: 'бюджет',
    tags: ['#снеговик', '#ведро', '#морковка', '#угольки'],
    search: ['snowman costume', 'carrot nose', 'bucket hat', 'coal eyes', 'twig arms'],
    palette: [
      ['Снег', '#F2F7FF'], ['Ведро', '#8FA3B8'], ['Морковка', '#F97316'],
      ['Уголь', '#232A36'], ['Шарф', '#C0172B']
    ]
  }
];

export const SLEIGH = {
  id: 'sleigh',
  kind: 'sleigh',
  eyebrow: 'Бонус',
  name: 'Сани Деда Мороза',
  role: 'Сцена в Studio',
  desc: 'Не скин, а сцена: сани с полозьями, фонарём и упряжкой из двух оленей. В README — размеры деталей и скрипт, который собирает модель в Roblox Studio.',
  colors: {
    coat: '#A5122A', trim: '#6D3A22', skin: '#9FB2C8', pants: '#6D3A22',
    boot: '#442315', gold: '#E6B45C', hair: '#442315', accent: '#FFD79A',
    belt: '#442315', glove: '#6D3A22'
  },
  size: 1,
  torsoW: 2.6,
  torsoD: 4.2,
  avatar: 'Roblox Studio · модель',
  animation: '—',
  budget: 'премиум',
  tags: ['#сани', '#полозья', '#фонарь', '#упряжь'],
  search: ['sleigh', 'sled', 'harness', 'lantern', 'gift boxes'],
  palette: [
    ['Кузов', '#A5122A'], ['Дерево', '#6D3A22'], ['Полозья', '#9FB2C8'],
    ['Золото', '#E6B45C'], ['Фонарь', '#FFD79A']
  ]
};

export const ITEMS = [...SKINS, SLEIGH];

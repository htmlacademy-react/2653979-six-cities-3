import { Review } from '../types/review';

export const MockReviews: Review[] = [
  {
    'id': '75a9bd8d-a179-407d-bdcd-b7917019d3f0',
    'comment': 'The house is very good, very happy, hygienic and simple living conditions around it are also very good. I hope to have the opportunity to come back. Thank you.',
    'date': '2025-03-04T21:00:00.190Z',
    'rating': 2,
    'user': {
      'name': 'Mollie',
      'avatarUrl': 'https://15.design.htmlacademy.pro/static/avatar/3.jpg',
      'isPro': false,
    },
  },
  {
    'id': '99d698e8-8efa-4214-98c0-d9c1f1c8511c',
    'comment': 'Bathed in the nature. Completely unplugged. Unforgettable.',
    'date': '2026-02-03T21:00:00.190Z',
    'rating': 3,
    'user': {
      'name': 'Zak',
      'avatarUrl': 'https://15.design.htmlacademy.pro/static/avatar/4.jpg',
      'isPro': true,
    },
  },
  {
    'id': 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
    'date': '2019-05-08T14:13:56.569Z',
    'user': {
      'name': 'Oliver Conner',
      'avatarUrl': 'https://15.design.htmlacademy.pro/static/avatar/1.jpg',
      'isPro': false,
    },
    'comment': 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
    'rating': 4,
  },
];

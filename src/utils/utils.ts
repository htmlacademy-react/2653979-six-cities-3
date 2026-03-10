export function getRandomNumber(min:number, max:number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function getReviewDate(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

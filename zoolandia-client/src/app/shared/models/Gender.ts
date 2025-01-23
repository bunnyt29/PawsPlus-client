export enum Gender {
  Male = 1,
  Female = 2
}

export const GenderTranslations: { [key in Gender]: string } = {
  [Gender.Male]: 'Мъжко',
  [Gender.Female]: 'Женско'
};

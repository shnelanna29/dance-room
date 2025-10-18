import * as yup from 'yup';

export const registrationSchema = yup.object({
  fullName: yup
    .string()
    .required('ФИО обязательно для заполнения')
    .min(3, 'ФИО должно содержать минимум 3 символа')
    .matches(/^[а-яА-ЯёЁ\s-]+$/, 'ФИО должно содержать только кириллицу'),
  birthDate: yup
    .date()
    .required('Дата рождения обязательна')
    .max(new Date(), 'Дата рождения не может быть в будущем')
    .test('age', 'Вам должно быть минимум 5 лет', function(value) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 5);
      return value <= cutoff;
    }),
  phone: yup
    .string()
    .required('Номер телефона обязателен')
    .matches(/^(\+7|8)?[\s(]?\d{3}[\s)]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, 'Некорректный формат номера телефона'),
  email: yup
    .string()
    .required('Email обязателен')
    .email('Некорректный формат email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
}).required();

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email обязателен')
    .email('Некорректный формат email'),
  password: yup
    .string()
    .required('Пароль обязателен')
}).required();

export const trialLessonSchema = yup.object({
  name: yup
    .string()
    .required('Имя обязательно для заполнения')
    .min(2, 'Имя должно содержать минимум 2 символа'),
  phone: yup
    .string()
    .required('Номер телефона обязателен')
    .matches(/^(\+7|8)?[\s(]?\d{3}[\s)]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, 'Некорректный формат номера телефона'),
  style: yup
    .string()
    .required('Выберите стиль танца')
}).required();

export const cancelBookingSchema = yup.object({
  reason: yup
    .string()
    .required('Укажите причину отмены')
    .min(10, 'Причина должна содержать минимум 10 символов')
}).required();

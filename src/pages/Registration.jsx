import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { registrationSchema } from '../utils/validationSchemas';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registrationSchema)
  });

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;
    registerUser(userData);
    alert('Регистрация успешна! Добро пожаловать в Dance Room!');
    navigate('/profile');
  };

  return (
    <div className="page">
      <Header />
      
      <main className="auth-main">
        <div className="container">
          <div className="auth-wrapper">
            <div className="auth-card">
              <h1 className="auth-title">Регистрация</h1>
              <p className="auth-subtitle">Создайте аккаунт и начните танцевать</p>

              <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="ФИО"
                  placeholder="Иванов Иван Иванович"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />

                <Input
                  label="Дата рождения"
                  type="date"
                  {...register('birthDate')}
                  error={errors.birthDate?.message}
                />

                <Input
                  label="Номер телефона"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  {...register('phone')}
                  error={errors.phone?.message}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="example@mail.ru"
                  {...register('email')}
                  error={errors.email?.message}
                />

                <Input
                  label="Пароль"
                  type="password"
                  placeholder="Минимум 6 символов"
                  {...register('password')}
                  error={errors.password?.message}
                />

                <Input
                  label="Подтверждение пароля"
                  type="password"
                  placeholder="Повторите пароль"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />

                <Button type="submit" fullWidth>
                  Зарегистрироваться
                </Button>
              </form>

              <div className="auth-footer">
                <p>Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registration;

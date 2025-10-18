import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { loginSchema } from '../utils/validationSchemas';
import './Registration.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = (data) => {
    const mockUser = {
      fullName: 'Иванов Иван Иванович',
      birthDate: '1995-05-15',
      phone: '+7 (999) 123-45-67',
      email: data.email,
      abonementNumber: '456789',
      abonementStart: '2025-10-01',
      abonementEnd: '2025-11-01'
    };
    
    login(mockUser);
    alert('Вход выполнен успешно!');
    navigate('/profile');
  };

  return (
    <div className="page">
      <Header />
      
      <main className="auth-main">
        <div className="container">
          <div className="auth-wrapper">
            <div className="auth-card">
              <h1 className="auth-title">Вход</h1>
              <p className="auth-subtitle">Войдите в свой аккаунт</p>

              <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder="Введите пароль"
                  {...register('password')}
                  error={errors.password?.message}
                />

                <Button type="submit" fullWidth>
                  Войти
                </Button>
              </form>

              <div className="auth-footer">
                <p>Нет аккаунта? <Link to="/registration" className="auth-link">Зарегистрироваться</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

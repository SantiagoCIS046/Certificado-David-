<script setup>
import { ref } from 'vue';
import { 
  Building2, 
  UserSquare2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Dot
} from 'lucide-vue-next';

const idNumber = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);

const handleLogin = () => {
  console.log('Login attempt:', {
    idNumber: idNumber.value,
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Left Section: Brand & Branding -->
      <div class="brand-section">
        <div class="brand-header">
          <div class="brand-logo">
            <Building2 :size="48" color="#4AB90E" />
          </div>
          <div class="brand-title">
            <h1>Portal Corporativo</h1>
            <span>SUPERVISIÓN OFICIAL</span>
          </div>
        </div>

        <div class="brand-content">
          <h2>Gestión Administrativa de Alto Nivel</h2>
          <div class="accent-bar"></div>
          <p>
            Acceda a las herramientas de monitoreo y control estratégico diseñadas para la excelencia institucional.
          </p>
        </div>

        <div class="brand-footer">
          <div class="footer-item">
            <span>PANEL DE CONTROL</span>
            <Dot :size="24" color="#4AB90E" />
            <span>SINCRONIZACIÓN SEGURA</span>
          </div>
        </div>
      </div>

      <!-- Right Section: Login Form -->
      <div class="form-section">
        <div class="form-header">
          <h2>INICIO DE SESIÓN</h2>
          <p>Ingrese sus credenciales oficiales para continuar al sistema.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>NÚMERO DE IDENTIFICACIÓN</label>
            <div class="input-wrapper">
              <UserSquare2 class="input-icon" :size="20" />
              <input 
                type="text" 
                v-model="idNumber" 
                placeholder="ID del Supervisor" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>CORREO INSTITUCIONAL</label>
            <div class="input-wrapper">
              <Mail class="input-icon" :size="20" />
              <input 
                type="email" 
                v-model="email" 
                placeholder="usuario@empresa.com" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>CONTRASEÑA</label>
            <div class="input-wrapper">
              <Lock class="input-icon" :size="20" />
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="••••••••" 
                required
              />
              <button 
                type="button" 
                class="toggle-password" 
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              Recordar sesión
            </label>
            <a href="#" class="forgot-link">¿Olvidó su contraseña?</a>
          </div>

          <button type="submit" class="submit-btn">
            INICIAR SESIÓN
            <ArrowRight :size="20" />
          </button>
        </form>

        <div class="form-footer">
          <p class="support-text">¿Tiene problemas para acceder?</p>
          <a href="#" class="support-link">SOPORTE TÉCNICO CORPORATIVO</a>
          
          <div class="security-badge">
            <ShieldCheck :size="14" />
            <span>CONEXIÓN SEGURA DE NIVEL EMPRESARIAL</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E9ECEF;
  overflow: hidden;
  padding: 0; // Removed padding to maximize screen usage
}

.login-card {
  width: 100%;
  height: 100%;
  background: $color-white;
  display: grid;
  grid-template-columns: 65% 35%; // Even narrower form section
  overflow: hidden;
  box-shadow: none; // Removed shadow for full-screen look
  border-radius: 0; // Removed border-radius for full-screen look
}

.brand-section {
  background: linear-gradient(135deg, $color-secondary 0%, #00301F 100%);
  padding: clamp(2rem, 5vh, 4rem) clamp(2rem, 5vw, 8rem); // Increased horizontal padding
  color: $color-white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 30%, rgba($color-primary, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }

  .brand-header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: clamp(2rem, 15vh, 8rem);

    .brand-logo {
      border-left: 2px solid $color-primary;
      padding-left: 1rem;
    }

    .brand-title {
      h1 {
        font-size: clamp(1.2rem, 2vw, 1.75rem);
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      span {
        font-size: clamp(0.6rem, 1vw, 0.75rem);
        font-weight: 600;
        color: rgba($color-white, 0.6);
        letter-spacing: 2px;
      }
    }
  }

  .brand-content {
    flex: 1;
    max-width: 400px;

    h2 {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 2rem;
    }

    .accent-bar {
      width: 50px;
      height: 4px;
      background-color: $color-primary;
      margin-bottom: 2rem;
    }

    p {
      font-size: clamp(0.9rem, 1.2vw, 1rem);
      color: rgba($color-white, 0.8);
      line-height: 1.6;
    }
  }

  .brand-footer {
    padding-top: 2rem;
    .footer-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: clamp(0.5rem, 0.8vw, 0.7rem);
      font-weight: 600;
      color: rgba($color-white, 0.7);
      letter-spacing: 1px;
    }
  }
}

.form-section {
  padding: clamp(2rem, 8vh, 4rem) clamp(2rem, 4vw, 3rem); // Further reduced horizontal padding
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  background-color: #FFFFFF;

  .form-header {
    margin-bottom: clamp(1.5rem, 5vh, 3rem);
    h2 {
      font-size: clamp(1.2rem, 2.5vw, 1.75rem);
      font-weight: 800;
      color: #000;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.9rem;
      color: $color-text-muted;
    }
  }

  .login-form {
    .form-group {
      margin-bottom: clamp(1rem, 2vh, 1.5rem);

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #1a1a1a;
          z-index: 1;
        }

        input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background-color: rgba(240, 242, 245, 0.4);
          border: 1.5px solid #888888; // Thicker and darker border for better visibility
          border-radius: 4px;
          font-size: 0.95rem;
          color: $color-text-dark;
          outline: none;
          transition: all 0.2s;
          backdrop-filter: blur(4px);

          &:focus {
            border-color: $color-primary;
            border-width: 2px; // Thicker on focus
            background-color: rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
          }

          &::placeholder {
            color: #ADB5BD;
          }
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #ADB5BD;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;

          &:hover {
            color: $color-text-muted;
          }
        }
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: clamp(1.5rem, 4vh, 2.5rem);

      .forgot-link {
        font-size: 0.85rem;
        font-weight: 700;
        color: #000;
        text-decoration: underline;
      }

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.85rem;
        color: $color-text-muted;
        cursor: pointer;
        user-select: none;

        input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }

    .submit-btn {
      width: 100%;
      background-color: $color-primary;
      color: $color-white;
      border: none;
      padding: clamp(0.75rem, 1.5vh, 1rem);
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: filter 0.2s;

      &:hover {
        filter: brightness(1.1);
      }
    }
  }

  .form-footer {
    margin-top: clamp(2rem, 10vh, 5rem);
    text-align: center;

    .support-text {
      font-size: 0.8rem;
      color: $color-text-muted;
      margin-bottom: 0.25rem;
      font-style: italic;
    }

    .support-link {
      font-size: 0.85rem;
      font-weight: 800;
      color: #343A40;
      text-decoration: none;
      letter-spacing: 0.5px;
    }

    .security-badge {
      margin-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #ADB5BD;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
  }
}

@media (max-width: 900px) {
  .login-container {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
  .login-card {
    grid-template-columns: 1fr;
    height: auto;
  }
  .brand-section {
    padding: 2rem;
    height: auto;
    .brand-header { margin-bottom: 2rem; }
  }
  .form-section {
    padding: 2rem;
    height: auto;
  }
}
</style>

<script setup>
import { ref, computed } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  LayoutGrid, 
  Users, 
  CheckCircle, 
  FileText, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  Download, 
  UserPlus, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from 'lucide-vue-next';

// Estado para la búsqueda y filtros
const searchQuery = ref('');
const activeFilter = ref('Todos');
const sortOrder = ref('recientes');

// Datos de ejemplo para la tabla de contratistas
const getInitialContratistas = () => {
  const saved = localStorage.getItem('supervisor_contratistas');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, nombres: 'Juan', apellidos: 'Pérez', tipoDoc: 'CC', numDoc: '12345678', estado: 'Aprobado' },
    { id: 2, nombres: 'María', apellidos: 'García', tipoDoc: 'CE', numDoc: '87654321', estado: 'No Aprobado' },
    { id: 3, nombres: 'Carlos', apellidos: 'Rodríguez', tipoDoc: 'CC', numDoc: '11223344', estado: 'Aprobado' },
    { id: 4, nombres: 'Ana', apellidos: 'Martínez', tipoDoc: 'PAS', numDoc: '99887766', estado: 'Pendiente' },
    { id: 5, nombres: 'Luis', apellidos: 'Sánchez', tipoDoc: 'CC', numDoc: '55443322', estado: 'Aprobado' },
  ];
};

const contratistas = ref(getInitialContratistas());

const filteredContratistas = computed(() => {
  let result = contratistas.value.filter(c => {
    // Filtrar por término de búsqueda (nombre, apellido o doc)
    const term = searchQuery.value.toLowerCase();
    const matchesSearch = c.nombres.toLowerCase().includes(term) ||
                          c.apellidos.toLowerCase().includes(term) ||
                          c.numDoc.includes(term);
                          
    // Filtrar por estado
    const matchesStatus = activeFilter.value === 'Todos' || c.estado === activeFilter.value;
    
    return matchesSearch && matchesStatus;
  });

  // Ordenar los resultados
  if (sortOrder.value === 'recientes') {
    result.sort((a, b) => b.id - a.id);
  } else if (sortOrder.value === 'antiguos') {
    result.sort((a, b) => a.id - b.id);
  } else if (sortOrder.value === 'alfabetico') {
    result.sort((a, b) => a.nombres.localeCompare(b.nombres));
  }
  
  return result;
});

// Manejador para acciones de gestión
const gestionarContratista = (id) => {
  console.log('Gestionando contratista:', id);
};

// Estado para el modal de agregar contratista
const showAddModal = ref(false);
const newContractor = ref({
  nombres: '',
  apellidos: '',
  tipoDoc: 'CC',
  numDoc: '',
  seguro: '',
  estado: 'Aprobado'
});

// Función para agregar un nuevo contratista a la lista
const submitContratista = () => {
  if (!newContractor.value.nombres || !newContractor.value.apellidos || !newContractor.value.numDoc) {
    return;
  }
  contratistas.value.unshift({
    id: Date.now(), // ID único basado en timestamp
    nombres: newContractor.value.nombres,
    apellidos: newContractor.value.apellidos,
    tipoDoc: newContractor.value.tipoDoc,
    numDoc: newContractor.value.numDoc,
    estado: newContractor.value.estado
  });
  
  // Persistir en localStorage
  localStorage.setItem('supervisor_contratistas', JSON.stringify(contratistas.value));
  
  // Cerrar modal y limpiar formulario
  showAddModal.value = false;
  newContractor.value = {
    nombres: '',
    apellidos: '',
    tipoDoc: 'CC',
    numDoc: '',
    seguro: '',
    estado: 'Aprobado'
  };
};

// Estado e implementación para Exportación y Notificaciones
const showExportModal = ref(false);
const exportFormat = ref('pdf');
const isSending = ref(false);
const sendSuccess = ref(false);

const openExportModal = () => {
  sendSuccess.value = false;
  isSending.value = false;
  exportFormat.value = 'pdf';
  showExportModal.value = true;
};

const exportarLista = () => {
  const data = filteredContratistas.value;
  if(data.length === 0) return alert('No hay datos para exportar');

  if(exportFormat.value === 'pdf') {
    const doc = new jsPDF();
    doc.text('Lista de Contratistas', 14, 15);
    const tableData = data.map(c => [c.nombres, c.apellidos, c.tipoDoc, c.numDoc, c.estado]);
    doc.autoTable({
      head: [['Nombres', 'Apellidos', 'Tipo Doc', 'Num Doc', 'Estado']],
      body: tableData,
      startY: 20
    });
    doc.save('contratistas_reporte.pdf');
  } 
  else if(exportFormat.value === 'excel') {
    const headers = ['Nombres', 'Apellidos', 'Tipo Doc', 'Num Doc', 'Estado'];
    const rows = data.map(c => `"${c.nombres}","${c.apellidos}","${c.tipoDoc}","${c.numDoc}","${c.estado}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contratistas_reporte.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  else if(exportFormat.value === 'word') {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Contratistas</title></head><body>";
    const footer = "</body></html>";
    let table = "<table border='1' style='border-collapse:collapse; width:100%'><tr><th>Nombres</th><th>Apellidos</th><th>Tipo Doc</th><th>Num Doc</th><th>Estado</th></tr>";
    data.forEach(c => {
      table += `<tr><td>${c.nombres}</td><td>${c.apellidos}</td><td>${c.tipoDoc}</td><td>${c.numDoc}</td><td>${c.estado}</td></tr>`;
    });
    table += "</table>";
    const sourceHTML = header + table + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'contratistas_reporte.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }
};

const notificarYGuardar = () => {
  if (filteredContratistas.value.length === 0) return alert('No hay contratistas en la vista para notificar');
  isSending.value = true;
  // Simular envío de correos y guardado en Drive
  setTimeout(() => {
    isSending.value = false;
    sendSuccess.value = true;
    setTimeout(() => {
      showExportModal.value = false;
    }, 2500);
  }, 2000);
};

// Estado e implementación para el Modal de Gestión Individual
const showManageModal = ref(false);
const selectedContractor = ref(null);

const confirmModalGestion = (contratista) => {
  selectedContractor.value = contratista;
  showManageModal.value = true;
};

const goToPlanilla = () => {
  // Simular ir a la planilla
  alert(`Redirigiendo a la planilla de revisión oficial de ${selectedContractor.value.nombres} ${selectedContractor.value.apellidos}...`);
  showManageModal.value = false;
};

</script>

<template>
  <div class="dashboard-layout">
    <!-- Main Content / Contenido Principal -->
    <main class="main-content">
      <!-- Top Navigation / Barra Superior -->
      <header class="top-nav">
        <div class="top-nav-actions">
          <div class="user-profile">
            <button class="notification-btn">
              <Bell :size="20" />
            </button>
            <div class="divider"></div>
            <div class="avatar">
               <img src="https://ui-avatars.com/api/?name=Supervisor+Admin&background=random" alt="User Avatar" />
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area / Area de Contenido -->
      <div class="content-wrapper">
        <div class="content-header">
          <div class="header-text">
            <h1>Listado de Contratistas</h1>
            <p>Gestión y monitoreo del estado de registro de contratistas activos.</p>
          </div>
          <div class="header-actions">
            <div class="search-bar">
              <Search :size="18" class="search-icon" />
              <input type="text" v-model="searchQuery" placeholder="Buscar contratista..." />
            </div>
          </div>
        </div>

        <!-- Filters Bar / Barra de Filtros -->
        <div class="filters-card">
          <div class="active-filters">
            <span class="filter-label">Estado:</span>
            <div class="filter-chip-btn" :class="{ active: activeFilter === 'Todos' }" @click="activeFilter = 'Todos'">
              Todos
            </div>
            <div class="filter-chip-btn" :class="{ active: activeFilter === 'Aprobado' }" @click="activeFilter = 'Aprobado'">
              Aprobados
            </div>
            <div class="filter-chip-btn" :class="{ active: activeFilter === 'No Aprobado' }" @click="activeFilter = 'No Aprobado'">
              No Aprobados
            </div>
            <div class="filter-chip-btn" :class="{ active: activeFilter === 'Pendiente' }" @click="activeFilter = 'Pendiente'">
              Pendientes
            </div>
          </div>
          <div class="sort-select">
            <select v-model="sortOrder">
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Antiguos</option>
              <option value="alfabetico">Alfabético</option>
            </select>
          </div>
        </div>

        <!-- Table Card / Tarjeta de Tabla -->
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>NOMBRES</th>
                <th>APELLIDOS</th>
                <th>TIPO DE DOCUMENTO</th>
                <th>NÚMERO DE DOCUMENTO</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredContratistas" :key="item.id">
                <td class="font-medium">{{ item.nombres }}</td>
                <td>{{ item.apellidos }}</td>
                <td class="text-muted">{{ item.tipoDoc }}</td>
                <td class="text-muted">{{ item.numDoc }}</td>
                <td>
                  <span class="status-badge" :class="{ 
                    'approved': item.estado === 'Aprobado',
                    'rejected': item.estado === 'No Aprobado',
                    'pending': item.estado === 'Pendiente'
                  }">
                    <span class="dot"></span>
                    {{ item.estado }}
                  </span>
                </td>
                <td>
                  <button class="btn-primary-sm" @click="confirmModalGestion(item)">
                    <FileText :size="16" />
                    <span>Gestionar</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination / Paginación (Fuera de la tarjeta) -->
        <footer class="table-footer">
          <p class="results-info">Mostrando 1 a 5 de 48 contratistas</p>
          <div class="pagination">
            <button class="page-btn"><ChevronLeft :size="18" /></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <span class="ellipsis">...</span>
            <button class="page-btn">10</button>
            <button class="page-btn"><ChevronRight :size="18" /></button>
          </div>
        </footer>

      </div>
    </main>

    <!-- Modal para Agregar Contratista -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Agregar Nuevo Contratista</h2>
          <button class="close-btn" @click="showAddModal = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitContratista" class="add-form">
            <div class="form-group row">
              <div class="col">
                <label>Nombres</label>
                <input type="text" v-model="newContractor.nombres" placeholder="Ingrese nombres" required />
              </div>
              <div class="col">
                <label>Apellidos</label>
                <input type="text" v-model="newContractor.apellidos" placeholder="Ingrese apellidos" required />
              </div>
            </div>
            <div class="form-group row">
              <div class="col">
                <label>Tipo Documento</label>
                <select v-model="newContractor.tipoDoc">
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="PAS">Pasaporte (PAS)</option>
                </select>
              </div>
              <div class="col">
                <label>Número de Documento</label>
                <input type="text" v-model="newContractor.numDoc" placeholder="Número de documento" required />
              </div>
            </div>
            <div class="form-group row">
              <div class="col">
                <label>Seguro (ARL/EPS/Otros)</label>
                <input type="text" v-model="newContractor.seguro" placeholder="Información del seguro" required />
              </div>
              <div class="col">
                <label>Estado Inicial</label>
                <select v-model="newContractor.estado">
                  <option value="Aprobado">Aprobado</option>
                  <option value="No Aprobado">No Aprobado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="showAddModal = false">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar Contratista</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para Exportar y Notificar -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="!isSending && (showExportModal = false)">
      <div class="modal-content export-modal">
        <div class="modal-header">
          <h2>Exportar y Notificar</h2>
          <button class="close-btn" @click="showExportModal = false" :disabled="isSending">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div v-if="!sendSuccess">
            <p class="export-desc">
              Seleccione el formato para exportar el reporte con la planilla de aprobación actual (<strong>{{ filteredContratistas.length }}</strong> registros listados):
            </p>
            <div class="format-selector">
              <label class="radio-label">
                <input type="radio" value="pdf" v-model="exportFormat" /> PDF Document
              </label>
              <label class="radio-label">
                <input type="radio" value="excel" v-model="exportFormat" /> Excel (CSV)
              </label>
              <label class="radio-label">
                <input type="radio" value="word" v-model="exportFormat" /> MS Word
              </label>
            </div>
            
            <button class="btn-secondary full-width mb-3" @click="exportarLista">
              <Download :size="18" /> Descargar Archivo Reporte
            </button>

            <div class="divider-text"><span>ACCIONES EN LA NUBE</span></div>

            <div class="notification-zone">
              <p>Guarda la lista completa de aprobaciones en el <strong>Drive del Supervisor</strong> y notifica por correo electrónico a cada contratista para adjuntarles su respectiva constancia de certificación.</p>
              <button class="btn-primary full-width" @click="notificarYGuardar" :disabled="isSending">
                <span v-if="isSending" class="spinner"></span>
                <span v-else>Guardar en Drive y Notificar Contratistas</span>
              </button>
            </div>
          </div>
          <div v-else class="success-message">
            <CheckCircle :size="48" color="#10B981" />
            <h3>¡Proceso Completado!</h3>
            <p>Se guardó la planilla en la carpeta de Drive del supervisor y se han enviado los correos de aprobación con sus respectivos certificados a los <strong>{{ filteredContratistas.length }}</strong> contratistas listados.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación para Gestionar Planilla Unitaria -->
    <div v-if="showManageModal" class="modal-overlay" @click.self="showManageModal = false">
      <div class="modal-content confirm-modal">
        <div class="modal-header bg-soft-blue">
          <h2>Revisión de Planilla</h2>
          <button class="close-btn" @click="showManageModal = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body text-center">
          <div class="confirm-icon-wrap">
            <FileText :size="48" color="#3B82F6" />
          </div>
          <h3 class="confirm-title">¿Estás seguro que quieres ver la planilla de este usuario?</h3>
          
          <div class="user-info-card" v-if="selectedContractor">
            <p><strong>Nombres:</strong> {{ selectedContractor.nombres }} {{ selectedContractor.apellidos }}</p>
            <p><strong>Identificación:</strong> {{ selectedContractor.tipoDoc }} {{ selectedContractor.numDoc }}</p>
            <p><strong>Seguro:</strong> {{ selectedContractor.seguro || 'No especificado' }}</p>
            <p><strong>Estado Actual:</strong> <span :class="['inline-status', selectedContractor.estado === 'Aprobado' ? 'text-green' : selectedContractor.estado === 'Pendiente' ? 'text-orange' : 'text-red']">{{ selectedContractor.estado }}</span></p>
          </div>

          <div class="modal-actions-centered">
            <button class="btn-secondary" @click="showManageModal = false">Volver</button>
            <button class="btn-primary" @click="goToPlanilla">Ir a la Planilla</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
@use '../styles/variables' as *;

// Estructura Base del Proyecto
.dashboard-layout {
  display: flex;
  height: 100vh;
  background-color: #F8FAFC;
  overflow: hidden;
}

// Menú Lateral (Sidebar) removido

// Contenido Principal
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh; // Altura fija al 100% del viewport
  overflow: hidden; // Evita el scroll global de la página
}

// Barra de Navegación Superior
.top-nav {
  height: 70px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2rem;
  flex-shrink: 0; // Asegura que no se encoja
  z-index: 10;

  .top-nav-actions {
    display: flex;
    align-items: center;
    gap: 3rem;

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;

      .divider {
        width: 1px;
        height: 24px;
        background-color: #E2E8F0;
      }

      .notification-btn {
        background: none;
        border: none;
        color: #64748B;
        cursor: pointer;
        padding: 0.25rem;
        &:hover { color: $color-primary; }
      }

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #F1F5F9;
        img { width: 100%; height: 100%; object-fit: cover; }
      }
    }
  }
}

// Area de Contenido
.content-wrapper {
  padding: 1.5rem 2rem 5rem; // Mayor padding inferior (5rem) para alejarlo del borde
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px); // Altura exacta restante
  overflow: hidden;

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;

    h1 {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 0.25rem;
    }
    p { color: #64748B; font-size: 0.95rem; }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      
      .search-bar {
        display: flex;
        align-items: center;
        background-color: #FFFFFF;
        border: 1px solid #E2E8F0;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        width: 320px;
        gap: 0.75rem;
        transition: border-color 0.2s;

        &:focus-within {
          border-color: $color-primary;
        }

        .search-icon { color: #94A3B8; }
        input {
          background: none;
          border: none;
          outline: none;
          font-size: 0.9rem;
          width: 100%;
          color: #1E293B;
          &::placeholder { color: #94A3B8; }
        }
      }
    }
  }
}

// Estilos de Botones
.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: $transition-base;
}

.btn-primary {
  background-color: $color-primary;
  color: #FFFFFF;
  border: none;
  &:hover { filter: brightness(1.1); }
}

.btn-secondary {
  background-color: #FFFFFF;
  color: #1E293B;
  border: 1px solid #E2E8F0;
  &:hover { background-color: #F8FAFC; }
}

// Barra de Filtros
.filters-card {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .active-filters {
    display: flex;
    align-items: center;
    gap: 1rem;

    .filter-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #94A3B8;
    }

    .filter-chip-btn {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 0.4rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748B;
      cursor: pointer;
      transition: all 0.2s;      

      &:hover {
        background-color: #F8FAFC;
        color: #334155;
      }
      
      &.active {
        background-color: #ECFDF5;
        border-color: #10B981;
        color: #059669;
      }
    }
  }

  .sort-select select {
    padding: 0.4rem 1rem;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    font-size: 0.85rem;
    color: #64748B;
    background-color: #FFFFFF;
    outline: none;
    cursor: pointer;
  }
}

// Boton Gestionar Pequeño
.btn-primary-sm {
  background-color: $color-primary;
  color: #FFFFFF;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(74, 185, 14, 0.15);

  &:hover {
    background-color: darken($color-primary, 5%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(74, 185, 14, 0.2);
  }
}

// Card de Tabla
.table-card {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow-y: auto; // Único scroll permitido para toda la tarjeta si el contenido es muy grande
  flex: 1; // Crece para ocupar el espacio restante
  display: flex;
  flex-direction: column;

  .data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    
    thead {
      background-color: #F8FAFC;
      border-bottom: 2px solid #F1F5F9;

      th {
        padding: 1.25rem 1.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        letter-spacing: 0.5px;
      }
    }

    tbody {
      
      tr {
        border-bottom: 1px solid #F1F5F9;
        transition: background-color 0.2s;

        &:hover { background-color: #F8FAFC; }

        td {
          padding: 1.25rem 1.5rem;
          font-size: 0.9rem;
          color: #334155;
          vertical-align: middle;

          &.font-medium { font-weight: 600; color: #1E293B; }
          &.text-muted { color: #64748B; }
        }
      }
    }
  }
}

// Badges de Estado
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;

  &.approved {
    background-color: #ECFDF5;
    color: #059669;
    border: 1px solid #D1FAE5;
    .dot { width: 6px; height: 6px; border-radius: 50%; background-color: #10B981; }
  }
  
  &.rejected {
    background-color: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FEE2E2;
    .dot { width: 6px; height: 6px; border-radius: 50%; background-color: #EF4444; }
  }
  
  &.pending {
    background-color: #FFFBEB;
    color: #D97706;
    border: 1px solid #FEF3C7;
    .dot { width: 6px; height: 6px; border-radius: 50%; background-color: #F59E0B; }
  }
}

// Link de Acción
.action-link {
  background: none;
  border: none;
  color: $color-secondary;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover { text-decoration: underline; }
}

// Pie de página (Fuera de la tarjeta)
.table-footer {
  padding: 1.5rem 0.5rem 0; // Padding superior para separarlo un poco, y a los lados
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent; // Transparente para usar el fondo general
  flex-shrink: 0; 
  margin-top: 0.5rem; // Espacio mínimo con la tabla

  .results-info { font-size: 0.8rem; color: #64748B; font-weight: 500; }

  .pagination {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .page-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 1px solid #E2E8F0;
      background-color: #FFFFFF;
      color: #64748B;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(.active) { background-color: #F1F5F9; }

      &.active {
        background-color: $color-primary;
        color: #FFFFFF;
        border-color: $color-primary;
      }
    }
    
    .ellipsis { padding: 0 0.5rem; color: #94A3B8; font-size: 0.8rem; }
  }
}

// Modal Styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.5); // Backdrop oscuro
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: #FFFFFF;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  overflow: hidden;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #E2E8F0;

    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: #64748B;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      border-radius: 6px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #F1F5F9;
        color: #0F172A;
      }
    }
  }

  .modal-body {
    padding: 1.5rem;

    .add-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &.row {
          flex-direction: row;
          gap: 1rem;
          .col {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }

        input, select {
          padding: 0.65rem 1rem;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #334155;
          outline: none;
          transition: border-color 0.2s;

          &:focus {
            border-color: $color-primary;
          }

          &::placeholder {
            color: #94A3B8;
          }
        }
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1.25rem;
        border-top: 1px solid #E2E8F0;
      }
    }
  }
}

// Estilos Modal de Exportar y Simulación Drive
.export-modal {
  max-width: 480px;
}

.export-desc {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  strong { color: #0F172A; }
}

.format-selector {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  background-color: #F8FAFC;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #E2E8F0;

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    cursor: pointer;
    font-weight: 500;
    color: #1E293B;
    accent-color: $color-primary;
  }
}

.full-width {
  width: 100%;
  justify-content: center;
}

.mb-3 { margin-bottom: 1.5rem; }

.divider-text { 
  display: flex; align-items: center; text-align: center; color: #94A3B8; font-size: 0.75rem; font-weight: 700; margin: 1.5rem 0;
  &::before, &::after { content: ''; flex: 1; border-bottom: 1px solid #E2E8F0; }
  span { padding: 0 0.75rem; letter-spacing: 0.5px; }
}

.notification-zone {
  background-color: #ECFDF5;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #D1FAE5;
  
  p { 
    font-size: 0.85rem; color: #065F46; margin-bottom: 1rem; line-height: 1.5; 
    strong { font-weight: 700; }
  }
}

.success-message {
  display: flex; flex-direction: column; align-items: center; text-align: center; padding: 2rem 1rem;
  h3 { margin: 1.25rem 0 0.5rem; color: #0F172A; font-size: 1.4rem; font-weight: 800; }
  p { color: #64748B; font-size: 0.95rem; line-height: 1.5; }
}

.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.4); border-bottom-color: #FFFFFF; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite;
}

@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

// Estilos Modal de Confirmación "Gestionar"
.confirm-modal {
  max-width: 440px;
}

.bg-soft-blue {
  background-color: #F0F9FF;
  border-bottom: 1px solid #E0F2FE;
  h2 { color: #0369A1; }
}

.text-center { text-align: center; }

.confirm-icon-wrap {
  background-color: #E0F2FE;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto 1.5rem;
}

.confirm-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.user-info-card {
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 1.25rem;
  text-align: left;
  margin-bottom: 2rem;
  
  p {
    font-size: 0.9rem;
    color: #475569;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;

    &:last-child { margin-bottom: 0; }
    strong { color: #1E293B; }
  }
}

.inline-status {
  font-weight: 700;
  &.text-green { color: #10B981; }
  &.text-red { color: #EF4444; }
  &.text-orange { color: #F59E0B; }
}

.modal-actions-centered {
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  button {
    flex: 1;
    padding: 0.75rem;
    font-size: 0.95rem;
  }
}

// Adaptación Móvil Básica
@media (max-width: 1024px) {
  .sidebar { width: 80px; .sidebar-brand span, .sidebar-nav span, .section-label, .badge { display: none; } }
}
</style>

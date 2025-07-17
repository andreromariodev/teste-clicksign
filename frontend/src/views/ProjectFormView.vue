<template>
  <AppLayout>
    <div class="container">
      <div :class="$style.header">
        <router-link to="/" :class="$style.backBtn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" />
          </svg>
          Voltar
        </router-link>
        <h1 :class="$style.title">{{ isEditing ? 'Editar Projeto' : 'Novo Projeto' }}</h1>
      </div>
      <div :class="$style.backForm">
        <div :class="$style.formPage">
          <div :class="$style.formContainer">
            <form @submit.prevent="onSubmit" :class="$style.form">
              <!-- Nome do Projeto -->
              <div :class="$style.formGroup">
                <label for="name" :class="$style.label">
                  Nome do projeto <span :class="$style.required">(Obrigatório)</span>
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  placeholder="Digite o nome do projeto"
                  :class="[$style.input, { [$style.error]: errors.name }]"
                  :disabled="loading"
                />
                <p v-if="errors.name" :class="$style.errorMessage">{{ errors.name }}</p>
              </div>

              <!-- Cliente -->
              <div :class="$style.formGroup">
                <label for="client" :class="$style.label">
                  Cliente <span :class="$style.required">(Obrigatório)</span>
                </label>
                <input
                  id="client"
                  v-model="form.client"
                  type="text"
                  placeholder="Digite o nome do cliente"
                  :class="[$style.input, { [$style.error]: errors.client }]"
                  :disabled="loading"
                />
                <p v-if="errors.client" :class="$style.errorMessage">{{ errors.client }}</p>
              </div>

              <!-- Datas -->
              <div :class="$style.dateRow">
                <div :class="$style.formGroup">
                  <label for="startDate" :class="$style.label">
                    Data de início <span :class="$style.required">(Obrigatório)</span>
                  </label>
                  <input
                    id="startDate"
                    v-model="form.startDate"
                    type="date"
                    :class="[$style.input, { [$style.error]: errors.startDate }]"
                    :disabled="loading"
                  />
                  <p v-if="errors.startDate" :class="$style.errorMessage">{{ errors.startDate }}</p>
                </div>

                <div :class="$style.formGroup">
                  <label for="endDate" :class="$style.label">
                    Data final <span :class="$style.required">(Obrigatório)</span>
                  </label>
                  <input
                    id="endDate"
                    v-model="form.endDate"
                    type="date"
                    :class="[$style.input, { [$style.error]: errors.endDate }]"
                    :disabled="loading"
                  />
                  <p v-if="errors.endDate" :class="$style.errorMessage">{{ errors.endDate }}</p>
                </div>
              </div>

              <!-- Capa do Projeto -->
              <div :class="$style.formGroup">
                <label for="cover" :class="$style.label">Capa do projeto</label>
                <div :class="$style.fileInputContainer">
                  <input
                    id="cover"
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    :class="$style.fileInput"
                    @change="onFileChange"
                    :disabled="loading"
                  />
                  <div :class="$style.fileInputDisplay" @click="triggerFileInput">
                    <div v-if="coverPreview" :class="$style.imagePreview">
                      <img :src="coverPreview" alt="Preview da capa" :class="$style.previewImage" />
                      <button
                        type="button"
                        @click.stop="removeCover"
                        :class="$style.removeImageBtn"
                        title="Remover imagem"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" />
                        </svg>
                      </button>
                    </div>
                    <div v-else :class="$style.uploadPlaceholder">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                          stroke="currentColor"
                          stroke-width="2"
                        />
                      </svg>
                      <p>Escolha uma imagem ou arraste aqui</p>
                      <p :class="$style.fileHint">PNG, JPG até 5MB</p>
                    </div>
                  </div>
                </div>
                <p v-if="errors.coverImage" :class="$style.errorMessage">{{ errors.coverImage }}</p>
              </div>

              <!-- Botões -->
              <div :class="$style.formActions">
                <button type="submit" :class="[$style.btn, $style.btnPrimary]" :disabled="loading">
                  <span v-if="loading" :class="$style.spinner"></span>
                  {{ isEditing ? 'Salvar projeto' : 'Criar projeto' }}
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="submitError" :class="$style.submitError">
                {{ submitError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { ProjectService } from '@/services/projectService'
import { useFormatting } from '@/composables/useFormatting'
import type { CreateProjectDto, UpdateProjectDto } from '@/types/project'

const route = useRoute()
const router = useRouter()
const { formatDateInput } = useFormatting()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)
const submitError = ref('')

const form = ref({
  name: '',
  client: '',
  startDate: '',
  endDate: '',
  coverImage: null as File | null,
  isFavorite: false,
})

const errors = ref({
  name: '',
  client: '',
  startDate: '',
  endDate: '',
  coverImage: '',
})

const fileInput = ref<HTMLInputElement>()
const coverPreview = ref('')

const validateForm = (): boolean => {
  errors.value = {
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    coverImage: '',
  }

  let isValid = true

  // Validação do nome do projeto - pelo menos duas palavras
  if (!form.value.name.trim()) {
    errors.value.name = 'Por favor, digite ao menos duas palavras'
    isValid = false
  } else {
    const words = form.value.name.trim().split(/\s+/)
    if (words.length < 2) {
      errors.value.name = 'Por favor, digite ao menos duas palavras'
      isValid = false
    }
  }

  // Validação do cliente - pelo menos uma palavra
  if (!form.value.client.trim()) {
    errors.value.client = 'Por favor, digite ao menos uma palavra'
    isValid = false
  } else {
    const words = form.value.client.trim().split(/\s+/)
    if (words.length < 1 || words[0] === '') {
      errors.value.client = 'Por favor, digite ao menos uma palavra'
      isValid = false
    }
  }

  if (!form.value.startDate) {
    errors.value.startDate = 'Selecione uma data válida'
    isValid = false
  }

  if (!form.value.endDate) {
    errors.value.endDate = 'Selecione uma data válida'
    isValid = false
  }

  if (form.value.startDate && form.value.endDate) {
    const startDate = new Date(form.value.startDate)
    const endDate = new Date(form.value.endDate)

    if (startDate >= endDate) {
      errors.value.endDate = 'Data final deve ser posterior à data de início'
      isValid = false
    }
  }

  return isValid
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      errors.value.coverImage = 'Apenas arquivos de imagem são permitidos'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.value.coverImage = 'Arquivo muito grande. Máximo 5MB'
      return
    }

    form.value.coverImage = file
    errors.value.coverImage = ''

    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeCover = () => {
  form.value.coverImage = null
  coverPreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const loadProject = async () => {
  if (!isEditing.value) return

  try {
    loading.value = true
    const project = await ProjectService.getProjectById(route.params.id as string)

    form.value = {
      name: project.name,
      client: project.client,
      startDate: formatDateInput(project.startDate),
      endDate: formatDateInput(project.endDate),
      coverImage: null,
      isFavorite: project.isFavorite,
    }

    if (project.coverImage) {
      coverPreview.value = `http://localhost:3001${project.coverImage}`
    }
  } catch (err) {
    submitError.value = 'Erro ao carregar projeto'
    console.error('Error loading project:', err)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  submitError.value = ''

  try {
    if (isEditing.value) {
      const updateData: UpdateProjectDto = {
        name: form.value.name,
        client: form.value.client,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        isFavorite: form.value.isFavorite,
        coverImage: form.value.coverImage,
      }

      await ProjectService.updateProject(route.params.id as string, updateData)
    } else {
      const createData: CreateProjectDto = {
        name: form.value.name,
        client: form.value.client,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        coverImage: form.value.coverImage,
      }

      await ProjectService.createProject(createData)
    }

    router.push('/')
  } catch (err: any) {
    submitError.value = err.response?.data?.error || 'Erro ao salvar projeto'
    console.error('Error saving project:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    loadProject()
  }
})
</script>

<style module>
.backForm {
  border-radius: 12px;
  border: 1px solid #dcdcdc;
  padding: 2rem;
}

.formPage {
  max-width: 700px;
  margin: 0 auto;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f1283;
  margin: 0;
}

.backBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1f1283;
  text-decoration: none;
  padding: 0.5rem 1rem 0.5rem 0;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.backBtn:hover {
  color: #475569;
  background-color: #f8fafc;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 500;
  color: #695CCD;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #717171;
  font-size: .85rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #717171;
  background-color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #695ccd;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.input.error {
  border-color: #ef4444;
}

.input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.errorMessage {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.dateRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.fileInputContainer {
  position: relative;
}

.fileInput {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.fileInputDisplay {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fileInputDisplay:hover {
  border-color: #695ccd;
  background-color: #faf7ff;
}

.uploadPlaceholder {
  color: #6b7280;
}

.uploadPlaceholder p {
  margin: 0.5rem 0;
}

.fileHint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.imagePreview {
  position: relative;
  display: inline-block;
}

.previewImage {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.removeImageBtn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.removeImageBtn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkboxLabel:hover {
  border-color: #695ccd;
}

.checkbox {
  display: none;
}

.checkboxText {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.checkbox:checked + .checkboxText {
  color: #695ccd;
}

.formActions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  justify-content: center;
  min-width: 120px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btnSecondary {
  background: #f3f4f6;
  color: #374151;
}

.btnSecondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btnPrimary {
  background: #695ccd;
  color: white;
}

.btnPrimary:hover:not(:disabled) {
  background: #7c3aed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.submitError {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .dateRow {
    grid-template-columns: 1fr;
  }

  .formActions {
    flex-direction: column;
  }
}
</style>

<template>
  <div :class="$style.projectCard">
    <div :class="$style.cardHeader">
      <div :class="$style.coverContainer">
        <img
          v-if="project.coverImage"
          :src="getCoverUrl(project.coverImage)"
          :alt="`Capa do projeto ${project.name}`"
          :class="$style.cover"
        />
        <div v-else :class="$style.placeholderCover">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <button
        :class="[$style.favoriteBtn, { [$style.favorited]: project.isFavorite }]"
        @click="onToggleFavorite"
        title="Favoritar projeto"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" :fill="project.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>

    <div :class="$style.cardBody">
      <h3 :class="$style.projectName" v-html="highlightText(project.name, searchTerm || '')"></h3>
      <p :class="$style.clientName" v-html="highlightText(project.client, searchTerm || '')"></p>

      <div :class="$style.dates">
        <div :class="$style.dateItem">
          <span :class="$style.dateLabel">Início:</span>
          <span :class="$style.dateValue">{{ formatDate(project.startDate) }}</span>
        </div>
        <div :class="$style.dateItem">
          <span :class="$style.dateLabel">Fim:</span>
          <span :class="[$style.dateValue, getDeadlineClass()]">
            {{ formatDate(project.endDate) }}
          </span>
        </div>
      </div>

      <div v-if="showDeadlineWarning" :class="$style.deadlineWarning">
        <span v-if="isOverdue(project.endDate)">
          Atrasado em {{ Math.abs(getDaysUntilDeadline(project.endDate)) }} dias
        </span>
        <span v-else>
          {{ getDaysUntilDeadline(project.endDate) }} dias restantes
        </span>
      </div>
    </div>

    <div :class="$style.cardActions">
      <router-link
        :to="`/projects/${project.id}`"
        :class="[$style.actionBtn, $style.viewBtn]"
        title="Ver projeto"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </router-link>
      <router-link
        :to="`/projects/${project.id}/edit`"
        :class="[$style.actionBtn, $style.editBtn]"
        title="Editar projeto"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2"/>
          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </router-link>
      <button
        :class="[$style.actionBtn, $style.deleteBtn]"
        @click="onDelete"
        title="Excluir projeto"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2"/>
          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'
import { useFormatting } from '@/composables/useFormatting'

interface Props {
  project: Project
  searchTerm?: string
}

interface Emits {
  (e: 'toggle-favorite', id: string): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { formatDate, highlightText, getDaysUntilDeadline, isOverdue, isNearDeadline } = useFormatting()

const showDeadlineWarning = computed(() => {
  return isOverdue(props.project.endDate) || isNearDeadline(props.project.endDate)
})

const getDeadlineClass = () => {
  if (isOverdue(props.project.endDate)) return 'overdue'
  if (isNearDeadline(props.project.endDate)) return 'nearDeadline'
  return ''
}

const getCoverUrl = (coverPath: string) => {
  return `http://localhost:3001${coverPath}`
}

const onToggleFavorite = () => {
  emit('toggle-favorite', props.project.id)
}

const onDelete = () => {
  emit('delete', props.project.id)
}
</script>

<style module>
.projectCard {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.projectCard:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.cardHeader {
  position: relative;
  height: 160px;
}

.coverContainer {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholderCover {
  color: #94a3b8;
  font-size: 2rem;
}

.favoriteBtn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.favoriteBtn:hover {
  background: white;
  transform: scale(1.1);
}

.favoriteBtn.favorited {
  color: #ef4444;
}

.cardBody {
  padding: 1rem;
  flex: 1;
}

.projectName {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.clientName {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.dates {
  margin-bottom: 0.75rem;
}

.dateItem {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.dateLabel {
  color: #64748b;
}

.dateValue {
  font-weight: 500;
  color: #374151;
}

.dateValue.overdue {
  color: #ef4444;
}

.dateValue.nearDeadline {
  color: #f59e0b;
}

.deadlineWarning {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  text-align: center;
  font-weight: 500;
}

.cardActions {
  padding: 0.75rem 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.actionBtn {
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
}

.viewBtn {
  background: #f1f5f9;
  color: #475569;
}

.viewBtn:hover {
  background: #e2e8f0;
}

.editBtn {
  background: #ddd6fe;
  color: #7c3aed;
}

.editBtn:hover {
  background: #c4b5fd;
}

.deleteBtn {
  background: #fecaca;
  color: #dc2626;
}

.deleteBtn:hover {
  background: #fca5a5;
}
</style>

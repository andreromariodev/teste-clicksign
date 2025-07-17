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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <button
        :class="$style.favoriteBtn"
        @click="onToggleFavorite"
        title="Favoritar projeto"
      >
        <svg
          v-if="project.isFavorite"
          width="30"
          height="29"
          viewBox="0 0 30 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2843_228)">
            <path
              d="M5.16398 8.58221C4.8452 8.28774 5.01836 7.7554 5.44953 7.70434L11.559 6.98049C11.7347 6.95968 11.8874 6.84945 11.9615 6.68894L14.5384 1.10852C14.7203 0.71469 15.2808 0.714615 15.4626 1.10845L18.0395 6.68882C18.1136 6.84933 18.2653 6.95986 18.441 6.98067L24.5508 7.70434C24.982 7.7554 25.1547 8.2879 24.8359 8.58237L20.3195 12.7551C20.1896 12.8751 20.1317 13.0538 20.1662 13.2271L21.3649 19.2547C21.4495 19.6801 20.9962 20.0097 20.6174 19.7979L15.249 16.7954C15.0946 16.7091 14.907 16.7095 14.7526 16.7958L9.3836 19.7971C9.00472 20.0089 8.55066 19.6801 8.63528 19.2547L9.83411 13.2275C9.8686 13.0541 9.8109 12.8751 9.68098 12.7551L5.16398 8.58221Z"
              fill="#FFB23D"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2843_228"
              x="0.499313"
              y="0.31311"
              width="29.0013"
              height="28.052"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2843_228"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2843_228"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

        <svg
          v-else
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2843_18)">
            <path
              d="M5.16398 9.1776C4.8452 8.88374 5.01836 8.35251 5.44953 8.30155L11.559 7.5792C11.7347 7.55843 11.8874 7.44843 11.9615 7.28825L14.5384 1.71938C14.7203 1.32636 15.2808 1.32628 15.4626 1.7193L18.0395 7.28813C18.1136 7.44831 18.2653 7.55861 18.441 7.57938L24.5508 8.30155C24.982 8.35251 25.1547 8.8839 24.8359 9.17776L20.3195 13.3419C20.1896 13.4616 20.1317 13.6399 20.1662 13.8129L21.3649 19.828C21.4495 20.2525 20.9962 20.5815 20.6174 20.3701L15.249 17.3738C15.0946 17.2877 14.907 17.2881 14.7526 17.3742L9.3836 20.3693C9.00472 20.5807 8.55066 20.2525 8.63528 19.828L9.83411 13.8133C9.8686 13.6403 9.8109 13.4616 9.68098 13.3418L5.16398 9.1776Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2843_18"
              x="-0.00163269"
              y="0.424576"
              width="30.0031"
              height="29.0134"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2843_18" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2843_18"
                result="shape"
              />
            </filter>
          </defs>
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
        <span v-else> {{ getDaysUntilDeadline(project.endDate) }} dias restantes </span>
      </div>
    </div>

    <div :class="$style.cardActions">
      <router-link
        :to="`/projects/${project.id}`"
        :class="[$style.actionBtn, $style.viewBtn]"
        title="Ver projeto"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      </router-link>
      <router-link
        :to="`/projects/${project.id}/edit`"
        :class="[$style.actionBtn, $style.editBtn]"
        title="Editar projeto"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </router-link>
      <button
        :class="[$style.actionBtn, $style.deleteBtn]"
        @click="onDelete"
        title="Excluir projeto"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" />
          <path
            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
            stroke="currentColor"
            stroke-width="2"
          />
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

const { formatDate, highlightText, getDaysUntilDeadline, isOverdue, isNearDeadline } =
  useFormatting()

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
  height: 232px;
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
  bottom: 14px;
  right: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  padding: 0;
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

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
      <div :class="$style.mainActions">
        <button :class="$style.favoriteBtn" @click="onToggleFavorite" title="Favoritar projeto">
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
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2843_18"
                />
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

        <div :class="$style.cardActions">
          <div :class="$style.actionsDropdown">
            <button
              :class="$style.actionsToggle"
              @click="toggleDropdown"
              @blur="closeDropdown"
              ref="dropdownToggle"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="1"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="currentColor"
                />
                <circle
                  cx="12"
                  cy="5"
                  r="1"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="currentColor"
                />
                <circle
                  cx="12"
                  cy="19"
                  r="1"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div v-if="isDropdownOpen" :class="$style.dropdownMenu">
              <router-link
                :to="`/projects/${project.id}`"
                :class="$style.dropdownItem"
                @click="closeDropdown"
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
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                  />
                </svg>
                Ver
              </router-link>

              <router-link
                :to="`/projects/${project.id}/edit`"
                :class="$style.dropdownItem"
                @click="closeDropdown"
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
                Editar
              </router-link>

              <button :class="[$style.dropdownItem, $style.deleteItem]" @click="handleDelete">
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
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :class="$style.cardBody">
      <h3 :class="$style.projectName" v-html="highlightText(project.name, searchTerm || '')"></h3>
      <p :class="$style.clientName">
        <strong>Cliente: </strong>
        <span v-html="highlightText(project.client, searchTerm || '')"></span>
      </p>

      <div :class="$style.dates">
        <div :class="$style.dateItem">
          <span :class="$style.dateLabel">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_2843_860"
                style="mask-type: luminance"
                maskUnits="userSpaceOnUse"
                x="2"
                y="0"
                width="21"
                height="24"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.5 3H20.75C21.9927 3 23 4.00734 23 5.25V21.75C23 22.9927 21.9927 24 20.75 24H4.25C3.00734 24 2 22.9927 2 21.75V5.25C2 4.00734 3.00734 3 4.25 3H6.5V0.5625C6.5 0.251859 6.75186 0 7.0625 0H7.4375C7.74814 0 8 0.251859 8 0.5625V3H17V0.5625C17 0.251859 17.2519 0 17.5625 0H17.9375C18.2481 0 18.5 0.251859 18.5 0.5625V3ZM20.7505 4.5H4.25049C3.83696 4.5 3.50049 4.83647 3.50049 5.25V7.5H21.5005V5.25C21.5005 4.83647 21.164 4.5 20.7505 4.5ZM20.7505 22.5H4.25049C3.83696 22.5 3.50049 22.1635 3.50049 21.75V9H21.5005V21.75C21.5005 22.1635 21.164 22.5 20.7505 22.5ZM11.3122 19.63L17.6305 13.3623C17.8512 13.1434 17.8527 12.7869 17.6337 12.5662L17.2372 12.1665C17.0182 11.9457 16.6618 11.9443 16.441 12.1633L10.92 17.64L8.55554 15.2688C8.33602 15.0486 7.97958 15.0481 7.75941 15.2676L7.36074 15.6651C7.14062 15.8847 7.1401 16.2411 7.35962 16.4613L10.517 19.6278C10.7362 19.8476 11.0919 19.8485 11.3122 19.63Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_2843_860)">
                <rect width="24" height="24" transform="translate(2)" fill="#717171" />
              </g>
            </svg>
          </span>
          <span :class="$style.dateValue">{{ formatDate(project.startDate) }}</span>
        </div>
        <div :class="$style.dateItem">
          <span :class="$style.dateLabel">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_2843_860"
                style="mask-type: luminance"
                maskUnits="userSpaceOnUse"
                x="2"
                y="0"
                width="21"
                height="24"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.5 3H20.75C21.9927 3 23 4.00734 23 5.25V21.75C23 22.9927 21.9927 24 20.75 24H4.25C3.00734 24 2 22.9927 2 21.75V5.25C2 4.00734 3.00734 3 4.25 3H6.5V0.5625C6.5 0.251859 6.75186 0 7.0625 0H7.4375C7.74814 0 8 0.251859 8 0.5625V3H17V0.5625C17 0.251859 17.2519 0 17.5625 0H17.9375C18.2481 0 18.5 0.251859 18.5 0.5625V3ZM20.7505 4.5H4.25049C3.83696 4.5 3.50049 4.83647 3.50049 5.25V7.5H21.5005V5.25C21.5005 4.83647 21.164 4.5 20.7505 4.5ZM20.7505 22.5H4.25049C3.83696 22.5 3.50049 22.1635 3.50049 21.75V9H21.5005V21.75C21.5005 22.1635 21.164 22.5 20.7505 22.5ZM11.3122 19.63L17.6305 13.3623C17.8512 13.1434 17.8527 12.7869 17.6337 12.5662L17.2372 12.1665C17.0182 11.9457 16.6618 11.9443 16.441 12.1633L10.92 17.64L8.55554 15.2688C8.33602 15.0486 7.97958 15.0481 7.75941 15.2676L7.36074 15.6651C7.14062 15.8847 7.1401 16.2411 7.35962 16.4613L10.517 19.6278C10.7362 19.8476 11.0919 19.8485 11.3122 19.63Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_2843_860)">
                <rect width="24" height="24" transform="translate(2)" fill="#717171" />
              </g>
            </svg>
          </span>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
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

const isDropdownOpen = ref(false)
const dropdownToggle = ref<HTMLButtonElement>()

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

const toggleDropdown = async () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    await nextTick()
    dropdownToggle.value?.focus()
  }
}

const closeDropdown = () => {
  setTimeout(() => {
    isDropdownOpen.value = false
  }, 150)
}

const handleDelete = () => {
  isDropdownOpen.value = false
  emit('delete', props.project.id)
}
</script>

<style module>
.projectCard {
  background: var(--color-background-primary);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: var(--transition-all);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.projectCard:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-2px);
}

.cardHeader {
  position: relative;
  height: var(--project-card-cover-height);
}

.coverContainer {
  width: 100%;
  height: 100%;
  background: var(--color-background-muted);
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
  color: var(--color-text-light);
  font-size: var(--font-size-2xl);
}

.mainActions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.favoriteBtn {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  padding: 0;
}

.cardBody {
  padding: var(--card-padding);
  flex: 1;
}

.projectName {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.clientName {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.dates {
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-muted);
}

.dateItem {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.dateLabel {
  color: var(--color-text-muted);
}

.dateValue {
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
}

.dateValue.overdue {
  color: var(--color-error);
}

.dateValue.nearDeadline {
  color: var(--color-warning);
}

.deadlineWarning {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.cardActions {
  display: flex;
  justify-content: flex-end;
}

.actionsDropdown {
  position: relative;
}

.actionsToggle {
  padding: var(--spacing-sm);
  border-radius: var(--radius-round);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-all);
  background: var(--color-background-primary);
  color: var(--color-text-light);
  box-shadow: var(--shadow-sm);
  transform: rotate(-90deg);
}

.actionsToggle:hover {
  background: var(--color-background-muted);
}

.dropdownMenu {
  position: absolute;
  right: 0;
  top: calc(100% + var(--spacing-xs));
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 120px;
  z-index: var(--z-index-dropdown);
  overflow: hidden;
}

.dropdownMenu::before {
  content: '';
  display: block;
  width: 12px;
  height: 9px;
  background: url('data:image/svg+xml;utf8,<svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.20759 1.02937C5.6079 0.509358 6.3921 0.509358 6.79241 1.02937L11.6888 7.39001C12.195 8.04757 11.7263 9 10.8964 9H1.10358C0.273737 9 -0.195026 8.04757 0.311171 7.39001L5.20759 1.02937Z" fill="white"/></svg>') no-repeat center/contain;
  position: absolute;
  top: -8px;
  right: 10px;
}

.dropdownItem {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: none;
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 500;
  text-decoration: none;
  color: var(--color-primary);
  transition: var(--transition-normal);
}

.dropdownItem:hover {
  background: var(--color-hover);
}

.deleteItem {
  color: var(--color-error-text);
}

.deleteItem:hover {
  background: var(--color-error-bg);
}
</style>

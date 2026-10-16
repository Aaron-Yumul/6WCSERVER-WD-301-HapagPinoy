<script setup>
import { computed, ref } from 'vue'
import { useMenu } from '../stores/menu'
import { formatPeso } from '../data/menuItems'
import { preOrderLimits } from '../data/schedule'

// modelValue is an object of { menuItemId: quantity }.
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue'])

const { items, categories, isLoading, hasError, menu, retry } = useMenu()

const wantsPreOrder = ref(Object.keys(props.modelValue).length > 0)
const activeCategory = ref('')

const visibleCategory = computed(() => activeCategory.value || categories.value[0]?.name || '')
const visibleItems = computed(() => items.value.filter((item) => item.category === visibleCategory.value))

const lines = computed(() =>
  items.value
    .filter((item) => (props.modelValue[item.id] || 0) > 0)
    .map((item) => ({ item, quantity: props.modelValue[item.id] })),
)
const totalQuantity = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0))
const totalPrice = computed(() => lines.value.reduce((sum, line) => sum + line.quantity * line.item.price, 0))

function quantityOf(id) {
  return props.modelValue[id] || 0
}

function canAdd(item) {
  return quantityOf(item.id) < preOrderLimits.maxQuantityPerDish && totalQuantity.value < preOrderLimits.maxTotalQuantity
}

function change(item, delta) {
  if (delta > 0 && !canAdd(item)) return
  const next = { ...props.modelValue }
  const quantity = Math.max(0, quantityOf(item.id) + delta)
  if (quantity === 0) delete next[item.id]
  else next[item.id] = quantity
  emit('update:modelValue', next)
}

function onToggle(checked) {
  wantsPreOrder.value = checked
  if (!checked) emit('update:modelValue', {})
}
</script>

<template>
  <div class="preorder">
    <label class="toggle">
      <input type="checkbox" :checked="wantsPreOrder" @change="onToggle($event.target.checked)" />
      <span class="toggle-text">
        <strong>Pre-order my meal</strong>
        <small>Pili na ng ulam! Choose your dishes now and we will have them ready when you arrive. You pay at the restaurant.</small>
      </span>
    </label>

    <div v-if="wantsPreOrder" class="picker">
      <div v-if="hasError" class="notice notice--error" role="alert">
        <p>{{ menu.error }}</p>
        <button type="button" class="btn btn--small" @click="retry">Try again</button>
      </div>
      <p v-else-if="isLoading" class="hint" role="status">Loading the menu...</p>

      <template v-else>
        <div class="rail" role="group" aria-label="Pre-order category">
          <button
            v-for="category in categories"
            :key="category.name"
            type="button"
            class="pill"
            :class="{ active: category.name === visibleCategory }"
            :aria-pressed="category.name === visibleCategory"
            @click="activeCategory = category.name"
          >
            {{ category.name }}
          </button>
        </div>

        <ul class="dishes">
          <li v-for="item in visibleItems" :key="item.id" class="dish" :class="{ picked: quantityOf(item.id) > 0 }">
            <div class="dish-info">
              <strong>{{ item.name }}</strong>
              <span>{{ formatPeso(item.price) }}</span>
            </div>
            <div class="stepper" role="group" :aria-label="`Quantity of ${item.name}`">
              <button type="button" :disabled="quantityOf(item.id) === 0" :aria-label="`Remove one ${item.name}`" @click="change(item, -1)">&minus;</button>
              <output :aria-label="`${quantityOf(item.id)} ordered`">{{ quantityOf(item.id) }}</output>
              <button type="button" :disabled="!canAdd(item)" :aria-label="`Add one ${item.name}`" @click="change(item, 1)">+</button>
            </div>
          </li>
        </ul>

        <div class="basket" aria-live="polite">
          <template v-if="lines.length">
            <h4>Your pre-order</h4>
            <ul class="basket-list">
              <li v-for="line in lines" :key="line.item.id">
                <span>{{ line.quantity }} &times; {{ line.item.name }}</span>
                <strong>{{ formatPeso(line.quantity * line.item.price) }}</strong>
              </li>
            </ul>
            <p class="basket-total"><span>Estimated total</span><strong>{{ formatPeso(totalPrice) }}</strong></p>
            <p class="hint">Paid at the restaurant. You can change the pre-order until the same deadline as the reservation.</p>
          </template>
          <p v-else class="hint">No dishes chosen yet. You can also reserve without a pre-order.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.preorder { display: grid; gap: 1rem; }
.toggle {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border: 1.5px dashed var(--terracotta);
  border-radius: var(--radius);
  background: var(--cream);
  cursor: pointer;
}
.toggle input { width: 1.2rem; height: 1.2rem; margin-top: 0.2rem; accent-color: var(--terracotta); flex: none; }
.toggle-text { display: grid; gap: 0.15rem; }
.toggle-text small { opacity: 0.8; font-size: 0.85rem; }

.picker { display: grid; gap: 1rem; }
.hint { margin: 0; font-size: 0.85rem; opacity: 0.8; }
.rail { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pill {
  font: inherit;
  font-size: 0.85rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid #D8C7A6;
  background: var(--white);
  color: var(--brown);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.pill:hover { border-color: var(--terracotta); }
.pill.active { background: var(--terracotta); border-color: var(--terracotta); color: var(--white); }

.dishes { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; max-height: 340px; overflow-y: auto; padding-right: 0.25rem; }
.dish {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid var(--beige);
  border-radius: var(--radius);
  background: var(--white);
}
.dish.picked { border-color: var(--gold); background: color-mix(in srgb, var(--gold) 12%, var(--white)); }
.dish-info { display: grid; min-width: 0; }
.dish-info span { font-size: 0.85rem; opacity: 0.75; }

.stepper { display: inline-flex; align-items: center; gap: 0.5rem; flex: none; }
.stepper button {
  width: 2rem;
  height: 2rem;
  font: inherit;
  font-size: 1.1rem;
  line-height: 1;
  border-radius: 50%;
  border: 1.5px solid var(--terracotta);
  background: var(--white);
  color: var(--terracotta);
  cursor: pointer;
}
.stepper button:hover:not(:disabled) { background: var(--terracotta); color: var(--white); }
.stepper button:disabled { opacity: 0.35; cursor: not-allowed; }
.stepper output { min-width: 1.5rem; text-align: center; font-weight: 600; }

.basket { padding: 1rem 1.1rem; border-radius: var(--radius); background: var(--cream); border: 1px solid var(--beige); }
.basket h4 { margin: 0 0 0.5rem; font-size: 1rem; }
.basket-list { list-style: none; margin: 0 0 0.6rem; padding: 0; display: grid; gap: 0.3rem; font-size: 0.92rem; }
.basket-list li { display: flex; justify-content: space-between; gap: 1rem; }
.basket-total { display: flex; justify-content: space-between; margin: 0 0 0.4rem; padding-top: 0.5rem; border-top: 1px dashed #D8C7A6; }
</style>

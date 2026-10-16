<script setup>
import { computed } from 'vue'

const props = defineProps({
  kind: { type: String, default: 'main' },
  tone: { type: String, default: '' },
})

const tones = {
  gold: '#E0A93B',
  leaf: '#6E8F4E',
  pesto: '#5E8A3E',
  tomato: '#C0472F',
  cheese: '#F0C75E',
  caramel: '#C98A45',
  cream: '#F2E2BF',
  pork: '#8A4B32',
  beef: '#6B3A28',
  sausage: '#A5522F',
  shrimp: '#E58B5F',
  steak: '#7A3B2A',
  salmon: '#EE8F6B',
  toast: '#D9A441',
  choco: '#4A2C20',
  ube: '#9B72B8',
  espresso: '#3E2418',
  latte: '#B58863',
  mocha: '#6B4430',
  mango: '#F2B33D',
  tea: '#C8791F',
  lemon: '#F0D55B',
  coconut: '#EFE6D2',
  pink: '#E36F7F',
}

const defaults = {
  appetizer: 'gold',
  pasta: 'tomato',
  rice: 'beef',
  main: 'steak',
  bread: 'toast',
  dessert: 'choco',
  coffee: 'latte',
  beverage: 'mango',
  bowl: 'caramel',
  rolls: 'gold',
}

const color = computed(() => {
  const name = props.tone || defaults[props.kind] || 'steak'
  return tones[name] || name
})

const art = computed(() => (defaults[props.kind] ? props.kind : 'main'))
</script>

<template>
  <svg class="dish-art" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
    <!-- Coffee: top-down cup on a saucer -->
    <g v-if="art === 'coffee'">
      <circle cx="80" cy="84" r="64" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="64" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="54" fill="#F3EBDD" />
      <rect x="112" y="72" width="42" height="16" rx="8" fill="#FFFFFF" stroke="#E8DCCB" stroke-width="2" />
      <circle cx="80" cy="80" r="42" fill="#FFFFFF" stroke="#E8DCCB" stroke-width="3" />
      <circle cx="80" cy="80" r="34" :fill="color" />
      <path d="M80 99 C57 84 60 65 72 65 C77 65 80 70 80 70 C80 70 83 65 88 65 C100 65 103 84 80 99Z" fill="#F7EAD6" opacity="0.92" />
      <path d="M80 70 L80 94" stroke="#B58863" stroke-width="2" stroke-linecap="round" opacity="0.6" />
      <g class="steam" fill="none" stroke="#D5C4AA" stroke-width="3" stroke-linecap="round">
        <path d="M62 44 q7 -8 0 -16 q-7 -8 0 -16" />
        <path d="M80 40 q7 -8 0 -16 q-7 -8 0 -16" style="animation-delay: 0.6s" />
        <path d="M98 44 q7 -8 0 -16 q-7 -8 0 -16" style="animation-delay: 1.2s" />
      </g>
    </g>

    <!-- Pasta: plate with a nest of noodles and sauce -->
    <g v-else-if="art === 'pasta'">
      <circle cx="80" cy="84" r="68" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="68" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="56" fill="#F3EBDD" />
      <g fill="none" stroke="#E6B85A" stroke-width="6" stroke-linecap="round">
        <circle cx="80" cy="80" r="40" stroke-dasharray="70 14" />
        <circle cx="80" cy="80" r="32" stroke-dasharray="54 12" transform="rotate(60 80 80)" />
        <circle cx="80" cy="80" r="24" stroke-dasharray="42 10" transform="rotate(130 80 80)" />
        <circle cx="80" cy="80" r="16" stroke-dasharray="28 8" transform="rotate(200 80 80)" />
      </g>
      <circle cx="80" cy="78" r="17" :fill="color" />
      <circle cx="74" cy="72" r="4" fill="#FFFFFF" opacity="0.25" />
      <ellipse cx="64" cy="64" rx="7" ry="3.5" fill="#5E8A3E" transform="rotate(-35 64 64)" />
      <ellipse cx="96" cy="66" rx="7" ry="3.5" fill="#5E8A3E" transform="rotate(30 96 66)" />
      <circle cx="90" cy="96" r="3" fill="#F7EAD6" />
      <circle cx="68" cy="94" r="3" fill="#F7EAD6" />
    </g>

    <!-- Rice meal: bowl with rice, egg and protein -->
    <g v-else-if="art === 'rice'">
      <circle cx="80" cy="84" r="68" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="68" fill="#7A2925" />
      <circle cx="80" cy="80" r="58" fill="#F3EBDD" />
      <circle cx="80" cy="80" r="50" fill="#FFFFFF" />
      <g stroke="#E8DCCB" stroke-width="2" stroke-linecap="round">
        <path d="M44 70 l5 2 M52 96 l5 -3 M60 56 l5 3 M110 100 l-5 -3 M116 76 l-5 2 M70 108 l5 -2" />
      </g>
      <g :fill="color" transform="rotate(-18 62 96)">
        <rect x="36" y="84" width="34" height="13" rx="6.5" />
        <rect x="42" y="100" width="34" height="13" rx="6.5" />
      </g>
      <ellipse cx="100" cy="66" rx="25" ry="21" fill="#FFFFFF" stroke="#E8DCCB" stroke-width="2" />
      <circle cx="102" cy="66" r="10" fill="#F2B632" />
      <circle cx="99" cy="63" r="3" fill="#FFFFFF" opacity="0.5" />
      <g fill="#5E8A3E">
        <circle cx="86" cy="98" r="3" /><circle cx="94" cy="104" r="3" /><circle cx="104" cy="100" r="3" /><circle cx="110" cy="92" r="3" />
      </g>
    </g>

    <!-- Main course: plate with the main item and sides -->
    <g v-else-if="art === 'main'">
      <circle cx="80" cy="84" r="68" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="68" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="56" fill="#F3EBDD" />
      <g transform="rotate(-14 62 82)">
        <rect x="32" y="58" width="60" height="46" rx="20" :fill="color" />
        <g stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.28">
          <path d="M44 68 L76 66 M42 80 L80 78 M46 92 L78 90" />
        </g>
      </g>
      <g fill="#5E8A3E">
        <circle cx="112" cy="62" r="10" /><circle cx="122" cy="74" r="9" /><circle cx="108" cy="76" r="8" />
      </g>
      <circle cx="108" cy="104" r="12" fill="#EBCB8B" />
      <circle cx="104" cy="101" r="4" fill="#F7E7B9" />
      <circle cx="58" cy="116" r="3.5" fill="#7A2925" /><circle cx="70" cy="119" r="3.5" fill="#7A2925" />
    </g>

    <!-- Bread: wooden board with loaf and roll -->
    <g v-else-if="art === 'bread'">
      <rect x="12" y="28" width="140" height="112" rx="24" fill="#000" opacity="0.18" transform="translate(0 4)" />
      <rect x="12" y="24" width="140" height="112" rx="24" fill="#C79A63" />
      <g stroke="#B58652" stroke-width="2" stroke-linecap="round" opacity="0.8">
        <path d="M28 48 H136 M26 74 H138 M28 100 H136 M32 122 H132" />
      </g>
      <g transform="rotate(-24 76 74)">
        <rect x="18" y="56" width="118" height="38" rx="19" :fill="color" />
        <g stroke="#F8E3A8" stroke-width="4" stroke-linecap="round" fill="none">
          <path d="M42 64 q8 10 0 22" /><path d="M64 63 q8 11 0 24" /><path d="M86 63 q8 11 0 24" /><path d="M108 64 q8 10 0 22" />
        </g>
      </g>
      <circle cx="116" cy="112" r="19" :fill="color" />
      <path d="M104 106 q12 -8 24 0" stroke="#F8E3A8" stroke-width="3" stroke-linecap="round" fill="none" />
    </g>

    <!-- Dessert: slice of cake on a plate -->
    <g v-else-if="art === 'dessert'">
      <ellipse cx="80" cy="120" rx="68" ry="20" fill="#000" opacity="0.18" />
      <ellipse cx="80" cy="114" rx="68" ry="20" fill="#FFFFFF" />
      <ellipse cx="80" cy="114" rx="52" ry="13" fill="#F3EBDD" />
      <rect x="38" y="52" width="84" height="22" rx="4" :fill="color" />
      <rect x="38" y="72" width="84" height="12" fill="#F7EAD6" />
      <rect x="38" y="82" width="84" height="22" rx="4" :fill="color" />
      <path d="M36 52 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 v6 H36Z" fill="#FFFFFF" opacity="0.9" />
      <circle cx="80" cy="36" r="9" fill="#C0392B" />
      <path d="M80 28 q6 -10 14 -10" stroke="#5E8A3E" stroke-width="3" fill="none" stroke-linecap="round" />
      <circle cx="77" cy="33" r="2.5" fill="#FFFFFF" opacity="0.5" />
    </g>

    <!-- Beverage: glass seen from above with ice, straw and lemon -->
    <g v-else-if="art === 'beverage'">
      <circle cx="80" cy="84" r="64" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="64" fill="#FFFFFF" opacity="0.85" />
      <circle cx="80" cy="80" r="56" :fill="color" />
      <g fill="#FFFFFF" opacity="0.55">
        <rect x="52" y="86" width="22" height="22" rx="5" transform="rotate(14 63 97)" />
        <rect x="84" y="94" width="20" height="20" rx="5" transform="rotate(-10 94 104)" />
        <rect x="90" y="56" width="20" height="20" rx="5" transform="rotate(24 100 66)" />
      </g>
      <line x1="84" y1="78" x2="124" y2="26" stroke="#7A2925" stroke-width="7" stroke-linecap="round" />
      <line x1="84" y1="78" x2="124" y2="26" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 9" />
      <circle cx="48" cy="52" r="15" fill="#F4DD72" stroke="#FFFFFF" stroke-width="3" />
      <g stroke="#FFFFFF" stroke-width="2" opacity="0.8">
        <path d="M48 40 V64 M36 52 H60 M40 44 L56 60 M56 44 L40 60" />
      </g>
    </g>

    <!-- Bowl: top-down bowl of soup or stew (sinigang, kare-kare, bulalo ...) -->
    <g v-else-if="art === 'bowl'">
      <circle cx="80" cy="84" r="68" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="68" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="58" fill="#F3EBDD" />
      <circle cx="80" cy="80" r="50" :fill="color" />
      <circle cx="80" cy="80" r="50" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.18" />
      <g fill="#FFFFFF" opacity="0.22">
        <circle cx="62" cy="104" r="3" /><circle cx="108" cy="92" r="2.5" /><circle cx="94" cy="58" r="3" />
      </g>
      <rect x="50" y="62" width="36" height="22" rx="10" fill="#8A4B32" transform="rotate(-22 68 73)" />
      <rect x="84" y="86" width="32" height="20" rx="9" fill="#9A5A3C" transform="rotate(16 100 96)" />
      <ellipse cx="100" cy="62" rx="13" ry="6" fill="#5E8A3E" transform="rotate(-30 100 62)" />
      <ellipse cx="58" cy="98" rx="11" ry="5.5" fill="#6E8F4E" transform="rotate(24 58 98)" />
      <ellipse cx="82" cy="112" rx="9" ry="4.5" fill="#5E8A3E" transform="rotate(-12 82 112)" />
      <circle cx="96" cy="84" r="5" fill="#D9663A" />
      <circle cx="64" cy="54" r="6" fill="none" stroke="#F7EAD6" stroke-width="3" />
    </g>

    <!-- Rolls: plate of fried rolls with a dip and a calamansi (lumpia, turon, cheese sticks) -->
    <g v-else-if="art === 'rolls'">
      <circle cx="80" cy="84" r="68" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="68" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="56" fill="#F3EBDD" />
      <g :fill="color">
        <rect x="30" y="50" width="62" height="17" rx="8.5" transform="rotate(-18 61 58)" />
        <rect x="36" y="73" width="62" height="17" rx="8.5" transform="rotate(-10 67 81)" />
        <rect x="42" y="96" width="62" height="17" rx="8.5" transform="rotate(-4 73 104)" />
      </g>
      <g stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.3">
        <path d="M42 58 L72 50 M48 80 L80 74 M54 102 L88 99" />
      </g>
      <circle cx="116" cy="100" r="16" fill="#FFFFFF" stroke="#E8DCCB" stroke-width="3" />
      <circle cx="116" cy="100" r="10" fill="#C0472F" />
      <circle cx="112" cy="56" r="9" fill="#8DB04E" stroke="#FFFFFF" stroke-width="3" />
      <path d="M112 49 V63 M105 56 H119" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8" />
    </g>

    <!-- Appetizer: plate with rings, a dip and a lemon wedge -->
    <g v-else>
      <circle cx="80" cy="84" r="68" fill="#000" opacity="0.18" />
      <circle cx="80" cy="80" r="68" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="56" fill="#F3EBDD" />
      <g fill="none" :stroke="color" stroke-width="8">
        <circle cx="56" cy="62" r="11" />
        <circle cx="82" cy="52" r="10" />
        <circle cx="70" cy="86" r="12" />
        <circle cx="46" cy="94" r="9" />
        <circle cx="94" cy="76" r="9" />
      </g>
      <circle cx="112" cy="102" r="17" fill="#FFFFFF" stroke="#E8DCCB" stroke-width="3" />
      <circle cx="112" cy="102" r="11" fill="#F7EAD6" />
      <path d="M92 118 a22 22 0 0 0 30 -4 Z" fill="#F4DD72" transform="translate(-16 6)" />
      <circle cx="104" cy="52" r="3" fill="#5E8A3E" /><circle cx="112" cy="58" r="3" fill="#5E8A3E" />
    </g>
  </svg>
</template>

<style scoped>
.dish-art {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.steam path {
  opacity: 0;
  animation: steam 3.2s ease-in-out infinite;
}
</style>

<template>
  <div class="authors-view">
    <h1 class="page-title">著名诗人</h1>
    <p class="page-description">这里汇集了中国历史上最杰出的诗人</p>
    
    <div class="authors-grid">
      <div v-for="author in authors" :key="author.id" class="author-card">
        <div class="author-avatar">
          {{ author.name.charAt(0) }}
        </div>
        <div class="author-info">
          <h3>{{ author.name }}</h3>
          <p class="dynasty">{{ author.dynasty }} · {{ author.title }}</p>
          <p class="intro">{{ author.intro }}</p>
          <p class="poems-count">代表作: {{ author.representativePoems.join('、') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  id: number
  name: string
  dynasty: string
  title: string
  intro: string
  representativePoems: string[]
}

const authors: Author[] = [
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    title: '诗仙',
    intro: '字太白，号青莲居士，唐代伟大的浪漫主义诗人，其诗豪放飘逸，想象丰富，语言流转自然，音律和谐多变。',
    representativePoems: ['静夜思', '望庐山瀑布', '将进酒', '蜀道难']
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    title: '诗圣',
    intro: '字子美，自号少陵野老，唐代伟大的现实主义诗人，其诗沉郁顿挫，反映社会现实，被誉为"诗史"。',
    representativePoems: ['春望', '登高', '茅屋为秋风所破歌', '三吏三别']
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋代',
    title: '东坡居士',
    intro: '字子瞻，号东坡居士，宋代文学巨匠，诗词书画俱佳，其词豪放洒脱，开创豪放词派。',
    representativePoems: ['水调歌头', '念奴娇·赤壁怀古', '江城子·密州出猎', '定风波']
  },
  {
    id: 4,
    name: '白居易',
    dynasty: '唐代',
    title: '诗魔',
    intro: '字乐天，号香山居士，唐代现实主义诗人，其诗语言通俗，反映民生疾苦，主张"文章合为时而著，歌诗合为事而作"。',
    representativePoems: ['琵琶行', '长恨歌', '赋得古原草送别', '卖炭翁']
  },
  {
    id: 5,
    name: '王维',
    dynasty: '唐代',
    title: '诗佛',
    intro: '字摩诘，唐代著名诗人、画家，其诗清新淡远，自然脱俗，将诗情画意融为一体，开创山水田园诗派。',
    representativePoems: ['山居秋暝', '相思', '使至塞上', '鹿柴']
  },
  {
    id: 6,
    name: '李清照',
    dynasty: '宋代',
    title: '易安居士',
    intro: '号易安居士，宋代著名女词人，婉约词派代表，其词语言清丽，感情真挚，善用白描手法。',
    representativePoems: ['声声慢', '如梦令', '醉花阴', '武陵春']
  }
]
</script>

<style scoped>
.authors-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: #0066cc;
  margin-bottom: 1rem;
}

.page-description {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.author-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.author-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #0066cc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-info h3 {
  color: #0066cc;
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.dynasty {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.intro {
  line-height: 1.6;
  color: #444;
  margin: 0 0 1rem;
}

.poems-count {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}
</style>
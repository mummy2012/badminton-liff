<template>
  <div>
    <nav class="navbar">
        <router-link to="/">🏸 Court Schedule</router-link> | 
        <router-link to="/schedule">📅 Schedule</router-link>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #1890ff;
  color: white;
  padding: 12px 16px;
  font-weight: bold;
}

</style>
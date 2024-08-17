<template>
  <div>
    <div class="box">
      <div class="a">
        <button
          style="position: absolute;
  margin: 10px 10px ;"
        >xxx</button>
      </div>
      <div class="b">
        <button
          style="position: absolute;
  margin: 10px 10px;"
        >xxx</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWord'
}
</script>

<style scoped>
.box {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.a {
  display: flex;
  justify-content: flex-end;
  position: relative;
  height: 300px;
  width: 100%;
  margin-right: 10px;
  background-color: gold;
}
.b {
  display: flex;
  justify-content: flex-end;
  position: relative;
  height: 300px;
  margin-right: 10px;
  width: 100%;
  background-color: pink;
}
</style>

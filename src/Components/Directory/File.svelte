<script>
  export let name;
  export let type;
  export let source;
</script>

<div
  style="background-image: url(tutorial/icons/{type}.svg)"
  on:click={() => console.log(source)}
>
  {name}.{type}
</div>

<style>
  div {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
    cursor: pointer;
  }
  div:hover {
    background-color: #b0dcf5;
  }
</style>

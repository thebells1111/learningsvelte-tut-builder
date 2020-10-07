<script>
  export let component;
  export let selectComponent;

  function handleClick() {
    selectComponent(component);
  }
</script>

<div
  style="background-image: url(icons/{component.type}.svg)"
  on:click={handleClick}
>
  {component.name}.{component.type}
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

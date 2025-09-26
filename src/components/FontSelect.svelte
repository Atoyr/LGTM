<script lang="ts">
  interface Props {
    value: string;
    onChange: (event: Event) => void;
  }

  let { value = $bindable(), onChange }: Props = $props();
</script>

<select id="font-family" bind:value={value} onchange={onChange}>
  <option value="serif">Serif</option>
  <option value="sans-serif">Sans-serif</option>         
  <option value="Arial">Arial</option>
  <option value="Verdana">Verdana</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Georgia">Georgia</option>
  <option value="Courier New">Courier New</option>
  <option value="Brush Script MT">Brush Script MT</option>
  <option value="Comic Sans MS">Comic Sans MS</option>
</select>

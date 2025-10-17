<script lang="ts">
    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() } = $props();
    
    async function getCourseWork() {
        if (!tokenResponse || !tokenResponse.access_token || !courseSelected)
            return null;
        const data = await fetch(`https://classroom.googleapis.com/v1/courses/${courseSelected}/courseWork`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        console.log(result);
        return result;
    }

    let classroomCourseWork = $derived(getCourseWork());
</script>

<div class="w-full h-screen flex">
    <div class="w-1/3"></div>
    <div class="w-2/3"></div>
</div>
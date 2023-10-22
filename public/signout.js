async function signout() {
    const response = await axios.post("/logout");
    console.log(response);
}
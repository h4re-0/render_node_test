$(document).ready(async function () {
    // URLを取得
    let url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    let params = url.searchParams;
    const id = params.get("id");
    $('textarea[name="id"]').val(id);

    const response = await axios.get('/quiz_single', {
        params: {
            id: id
        }
    });

    $('textarea[name="content"]').val(response.data.content);
    $('textarea[name="answer"]').val(response.data.answer);
    $('textarea[name="comment"]').val(response.data.comment);

    $('#post-quiz').submit(async function (event) {
        event.preventDefault(); // デフォルトのフォーム送信動作をキャンセル


        const id = $('textarea[name="id"]').val();
        const content = $('textarea[name="content"]').val();
        const answer = $('textarea[name="answer"]').val();
        const comment = $('textarea[name="comment"]').val();

        $("#submitbutton").prop("disabled", true);

        console.log(id);

        const response = await axios.put("/put_quiz", {
            id: id,
            content: content,
            answer: answer,
            comment: comment
        });

        window.location.href = "/";
        return false;
    });
});
$(document).ready(function () {
    // URLを取得
    let url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    let params = url.searchParams;

    $('textarea[name="id"]').val(params.get("id"));
    $('textarea[name="content"]').val(params.get("content"));
    $('textarea[name="answer"]').val(params.get("answer"));
    $('textarea[name="comment"]').val(params.get("comment"));

    $("#submitbutton").prop("disabled", true);
    
    $('#post-quiz').submit(async function (event) {
        event.preventDefault(); // デフォルトのフォーム送信動作をキャンセル


        const id = $('textarea[name="id"]').val();
        const content = $('textarea[name="content"]').val();
        const answer = $('textarea[name="answer"]').val();
        const comment = $('textarea[name="comment"]').val();

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
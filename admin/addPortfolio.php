<?php
// error_reporting(0/);
include '../auth/conn.php';
$msg = "";

if (isset($_POST['submit'])) {

    $name = time();
    $title = $_POST['title'];
    $description = $_POST['desc'];
    if ($title != null && $description != null ) {


    // getting file uplaod 
        $target = "../upload/portfolio/";
        $filename = $name . basename($_FILES['photo']['name']);
        $target = $target . $name . basename($_FILES['photo']['name']);

        // inserting into db 
        $sql = "INSERT INTO portfolio (title,desc_key,photo,created_At) VALUES ('{$title}','{$description}','{$filename}',NOW())";
        echo $sql;
        $query = mysqli_query($conn, $sql);

        // Now let's move the uploaded image into the folder: image
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
            echo "<h3> Image uploaded successfully!</h3>";
            header('Location: ' . $_SERVER['HTTP_REFERER']);

        } else {
            echo "<h3> Failed to upload image!</h3>";
        }
    } else {
    }
}

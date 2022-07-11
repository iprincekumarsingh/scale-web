<?php

error_reporting(1);
include '../auth/conn.php';
// echo $_GET["id"];
$id = $_GET['id'];
$sql_query = "DELETE FROM portfolio WHERE pid = '{$_GET['id']}'";
// echo $sql_query;

$query = mysqli_query($conn, $sql_query);

if ($query) {
    header('Location: ' . $_SERVER['HTTP_REFERER']);

    // echo "d";
        // header("Location:" . $_SERVER[HTTP_] . "?message=" . $message);
    // echo '<p><a href="javascript:history.go(-1)" title="Return to the previous page">« Go back</a></p>';
}

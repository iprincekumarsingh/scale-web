<?php
include 'conn.php';
$username = $_POST['username'];
$password = $_POST['password'];

session_start();


$sql_query = "SELECT * FROM user where username = '{$username}'";

$query = mysqli_query($conn, $sql_query);

if ($query) {
    while ($row = mysqli_fetch_assoc($query)) {
        if ($password == $row['password']) {
            echo "Login Successfull";
            $_SESSION['role'] = "admin";
            $_SESSION['name'] = $row['name'];
            $_SESSION['id'] = $row['uid'];

            header("Location: ../dashboard/");
        } else {
            echo "Wrong";
        }
    }
}

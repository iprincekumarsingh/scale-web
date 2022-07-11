
<?php
include 'conn.php';
$username = $_POST['username'];
$password = $_POST['password'];

session_start();

$sql_query = "SELECT * FROM user where username = '{$username}' AND password = '{$password}'";
echo $sql_query;
$query = mysqli_query($conn, $sql_query);

if (mysqli_num_rows($query) === 1) {
    $row = mysqli_fetch_assoc($query);
    header("Location: ../admin/dashboard");
} else {
    header("Location: ../admin/index.php?error=Username,password is incorrect");
}

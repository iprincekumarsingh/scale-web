<?php
// error_reporting(0);
$server = "localhost";
$db_user = "root";
$db_table = "scaleservices";
$db_password = "";

$conn = mysqli_connect($server, $db_user, $db_password, $db_table);

if ($conn) {
} else {
    echo "Failed to connect the database";
}

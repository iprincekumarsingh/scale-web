<?php
include 'auth/conn.php';

$sql_query = "SELECT * FROM portfolio";

$result = mysqli_query($conn, $sql_query);

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo $row['title'];
        echo "<br>";
        echo $row['desc_key'];
        echo "<br>";
?>
        <img width="100px" src="upload/portfolio/<?php echo $row['photo'] ?>">
<?php


    }
}

?>
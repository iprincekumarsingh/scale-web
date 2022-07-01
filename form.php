<?php
// Get data from form
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$subject = $_POST['subject'];


$message = $_POST['inputMessage'];

$to = "";
$subject = `$subject` . " | Scale ";

// The following text will be sent
// Name = user entered name
// Email = user entered email
// Message = user entered message
$txt = "Name = " . $name . "\r\n Subject = " . $subject . "\r\n Email = "
    .  $email . "\r\n Message =" . $message;

$headers = "From: scale@scaleservice." . "\r\n" .
    "BCC: me@divelink.in";;
if ($email != NULL) {
    mail($to, $subject, $txt, $headers);
}

// Redirect to
header("Location:index.html");

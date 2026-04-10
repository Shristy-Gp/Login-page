<?php
include "db.php";

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirm = $_POST['confirm_password'];

if($password != $confirm){
    echo "Passwords do not match!";
    exit();
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (username, email, password)
        VALUES ('$username', '$email', '$hashed_password')";

if(mysqli_query($conn, $sql)){
    header("Location: login.php");
    exit();
} else {
    echo "Error: " . mysqli_error($conn);
}
?>
<?php
session_start();
include "db.php";

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username='$username'";
$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result) > 0){
    $row = mysqli_fetch_assoc($result);

    // check password
    if(password_verify($password, $row['password'])){
        $_SESSION['username'] = $username;

        // redirect to home page
        header("Location: home.php");
        exit();
    } else {
        echo "Wrong Password!";
    }
} else {
    echo "User not found!";
}
?>
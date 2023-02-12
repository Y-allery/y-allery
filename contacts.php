<?php
$uploadOk = 1;
$errors = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['files'])) {
        $errors = [];
        $path = 'uploads/';
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];
        
        $all_files = count($_FILES['files']['tmp_name']);
        
        for ($i = 0; $i < $all_files; $i++) {
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
            $file_ext = strtolower(end(explode('.', $_FILES['files']['name'][$i])));
            
            $file = $path . $file_name;
            
            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            }
            
            if ($file_size > 2097152) {
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
            }
            
            if (empty($errors)) {
                move_uploaded_file($file_tmp, $file);
            }
        }
        
        //if ($errors) print_r($errors);
    }
}


function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

$Err = '';

if (!empty($_POST))
{
    
    $user__name = $_POST["user_name"];
    if ( !isset($user__name) || (isset($user__name) && $user__name === 'undefined' ) ) {
        //$Err = "Name is required<br/>";
        $clientName = '';
    }
    else {
        $name = test_input($_POST["user_name"]);
        // check if name only contains letters and whitespace
        if ( !preg_match("/[а-яА-ЯA-Za-z ]{3,50}/",$name) )  {
            $Err .= "Только буквы и пробел допустимы в имени";
        }
        else {  $clientName = $name; }
    }
    
    
    
    $user__Phone = $_POST["user_phone"];
    if ( !isset($user__Phone) || (isset($user__Phone) && $user__Phone === 'undefined' ) ) {
        //$Err .= "Phone is required<br/>";
        $clientPhone = '';
    }
    else {
        $phone = test_input($_POST["user_phone"]);
        $clientPhone = $phone;
    }
    
    
    
    if ( !isset($_POST["user_email"]) || (isset($_POST["user_email"]) && $_POST["user_email"] === 'undefined' ) ) {
        //$Err .= "Email is required<br/>";
        $clientEmail = '';
    }
    else  {
        $email = test_input($_POST["user_email"]);
        // check if e-mail address syntax is valid
        if ( !preg_match("/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/",$email) )  {
            $Err .= "Неверний формат email<br/>";
        }
        else { $clientEmail = $email;  }
    }
    
    
   
    
    if ( !isset($_POST["year_issue"]) || (isset($_POST["year_issue"]) && $_POST["year_issue"] === 'undefined' ) ) {
        $year_issue = "";
    }
    else  {
        $year_issue = test_input($_POST["year_issue"]);
    }
    
    
    if ( !isset($_POST["model_make"]) || (isset($_POST["model_make"]) && $_POST["model_make"] === 'undefined' ) ) {
        $model_make = "";
    }
    else  {
        $model_make = test_input($_POST["model_make"]);
    }
    
    if ( !isset($_POST["current_price"]) || (isset($_POST["current_price"]) && $_POST["current_price"] === 'undefined' ) ) {
        $current_price = "";
    }
    else  {
        $current_price = test_input($_POST["current_price"]);
    }
    
    if ( !isset($_POST["user_message"]) || (isset($_POST["user_message"]) && $_POST["user_message"] === 'undefined' ) ) {
        $user_message = "";
    }
    else  {
        $user_message = test_input($_POST["user_message"]);
    }
    
    if ( !isset($_POST["subject"]) || (isset($_POST["subject"]) && $_POST["subject"] === 'undefined' ) ) {
        $subject = "";
    }
    else  {
        $subject = test_input($_POST["subject"]);
    }
    
    
    //if ( empty($clientName) or empty($clientEmail) or empty($comment) ) {  }
    if ($Err) { echo $Err; }
    else {
        $mess = '';
//$image_target_path = "https://simpladent.kiev.ua/";
        
        
        if ( !$errors ) {
        }
        
        $mess .= '<p>Имя  - '.$clientName.'</p>';
    
        if ( $subject ) {
            $mess .= '<p>'.'Тип сообщения - '.$subject.'</p>';
        }
        
        if ( $clientPhone ) {
            $mess .= '<p>'.'Телефон - '.$clientPhone.'</p>';
        }
    
        if ( $year_issue ) {
            $mess .= '<p>'.'Год выпуска - '.$year_issue.'</p>';
        }
    
        if ( $model_make ) {
            $mess .= '<p>'.'Марка и модель авто - '.$model_make.'</p>';
        }
    
        if ( $current_price ) {
            $mess .= '<p>'.'Бюджет авто - '.$current_price.'</p>';
        }
    
        if ( $user_message ) {
            $mess .= '<p>'.'Собщение отправителя - '.$user_message.'</p>';
        }
        
        $to = 'documentslars@gmail.com, mariya.turlak@gmail.com';
        
        
        $tt = mail($to, 'Письмо от LARS', $mess,
            "Content-type: text/html; charset=UTF-8\r\n".
            "From: LARS\r\n"
            ."X-Mailer: PHP/" . phpversion()
        );
        
        if ( $tt ) {
            $outMess = 'ok';
        } else {
            $outMess .= "Возникла ошибка при отправке письма";
        }
    }
    
    echo $outMess;
    
}
?>
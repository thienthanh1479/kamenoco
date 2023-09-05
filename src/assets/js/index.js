$(document).ready(function(){
  $(".header-sp-menu").click(function () { 
    $(this).toggleClass("active");
    $(".header-nav").toggleClass("open");
  });

  $(".header-nav a").click(function () { 
    $(".header-sp-menu").toggleClass("active");
    $(".header-nav").toggleClass("open");
  });
});
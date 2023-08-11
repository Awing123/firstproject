<template>
    <div class="titleBorder">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.titleBorder{
    position: relative; 
    height: 20px;
    line-height: 20px;
    font-size: 17px;
    padding: 20px 0px 14px 9px;
    
    

    &::after{
        content: "";
        position: absolute;
        width: 2px;
        left:0;
        height: 16px;
        background-color: #d33a31;
    }
}
</style>
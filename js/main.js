/**
 * Created by anthony on 2017/8/21.
 */


//   1.翻面控制
function turn (elem) {
    var cls = elem.className;
    var n=elem.id.split("_")[1];

    if(!/photo_center/.test(cls)){
        return rsort(n);
    }
    //  /photo_front/.test(cls) 如果存在 .photo_front，返回TRUE，否则返回FALSE
    if (/photo_front/.test(cls)) {
        cls = cls.replace(/photo_front/, 'photo_back');
        g('#nav_'+n).className +=' i_back';
    } else {
        cls = cls.replace(/photo_back/, 'photo_front');
        g('#nav_'+n).className =g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
    }
    return elem.className = cls;
}
//    2.修改视图为模板字符串 详见index.html {{xxx}}

//    3.通用函数
    function g(selector) {
        //substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
        //method：根据传入的selector确定需要的方法是'getElementByClassName'或者'getElementById'
        var method = selector.substr(0,1)=='.'?'getElementsByClassName':'getElementById';
        return document[method](selector.substr(1));
    }
//    生成一个值 支持范围。random([min,max]);
function random(range) {
    var max=Math.max(range[0],range[1]);
    var min=Math.min(range[0],range[1]);
    var diff=max-min;  //差值
    var number=Math.ceil(Math.random()*diff+min);
    return number;
}
//    4.输出所有的海报
    var data=data;
    function addPhotos() {
        var template=g('#wrap').innerHTML;
        var html=[];
        var nav=[];
        // for(s in data){
         for(var s=0;s<data.length;s++){
            var _html=template.replace('{{index}}',s)
                              .replace('{{img}}',s+1+'.jpg')//data[s].img
                              .replace('{{caption}}',data[s].caption)
                              .replace('{{desc}}',data[s].desc);
            html.push(_html);
            nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" ' +
                'class="i">&nbsp;</span>');
        }
        html.push('<div class="nav">'+nav.join('')+'</div>');
        g('#wrap').innerHTML=html.join('');
        rsort(random([0,data.length]));
}
addPhotos();
    //6.计算左右分区的范围 返回{left:{x:[min,max],y:[]},right:{x:[],y:[]}
function range() {
    var range={left:{x:[],y:[]},right:{x:[],y:[]}};
    var wrap={
        w:g('#wrap').clientWidth,
        h:g('#wrap').clientHeight
    };
    var photo={
        w:g('.photo')[0].clientWidth,
        h:g('.photo')[0].clientHeight
    };
    range.wrap=wrap;
    range.photo=photo;
    //左右照片的范围

    //大范围
    // range.left.x=[0-photo.w,wrap.w/2-photo.w/2];
    // range.left.y=[0-photo.h,wrap.h];
    // range.right.x=[wrap.w/2+photo.w/2,wrap.w+photo.w];
    // range.right.y=range.left.y;

    //小范围
    range.left.x=[0,wrap.w/2-photo.w];
    range.left.y=[0,wrap.h];
    range.right.x=[wrap.w/2+photo.w,wrap.w];
    range.right.y=range.left.y;
    return range;

}
    //5.排序海报
function rsort(n) {
    var _photo=g('.photo');
    var photos=[];
    for(var s=0;s<_photo.length;s++){
        _photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,' ');
        _photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,' ');
        _photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,' ');

        _photo[s].className +=' photo_front';
        _photo[s].style.left = '';
        _photo[s].style.top = '';
        _photo[s].style['transform'] = 'rotate(360deg) scale(1.3)';
        photos.push(_photo[s]);
    }
    var photo_center=g('#photo_'+n);
    photo_center.className+=' photo_center';
    //去除在正中间的海报
    photo_center=photos.splice(n,1)[0];
//    把剩下的海报分为左右两部分
    var photos_left=photos.splice(0,Math.ceil(photos.length/2));
    var photos_right=photos;

    var ranges=range();
    for(var s in photos_left){
        var photo=photos_left[s];
        photo.style.left = random(ranges.left.x)+'px';
        photo.style.top = random(ranges.left.y)+'px';
        photo.style['transform']='rotate('+random([-150,150])+'deg) scale(1)';
    }
    for(var s in photos_right){
        var photo=photos_right[s];
        photo.style.left = random(ranges.right.x)+'px';
        photo.style.top = random(ranges.right.y)+'px';
        photo.style['transform']='rotate('+random([-150,150])+'deg) scale(1)';
    }
    //控制按钮处理
    var navs=g('.i');
    for(var s=0;s<navs.length;s++){
        navs[s].className =navs[s].className.replace(/\s*i_current\s*/,' ');
        navs[s].className =navs[s].className.replace(/\s*i_back\s*/,' ');
    }
    g('#nav_'+n).className += ' i_current';

}
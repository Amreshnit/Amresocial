class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type : 'POST',
                url : $(self).attr('href')
            })
            .done(function(data){
                let likesCount = parseInt($(self).attr('data-likes'));
                if(data.data.deleted==true){
                    likesCount -= 1;
                }else{
                    likesCount += 1;
                }

                $(self).attr('data-likes',likesCount);

                if(data.data.deleted==false){
                    $(self).html(`${likesCount} <i class="fas fa-thumbs-up"></i>`);
                }
                else{
                    $(self).html(`${likesCount} <i class="far fa-thumbs-up"></i>`);
                }
                


            })
            .fail(function(err){
                console.log('Error in creating ajax for likes',err);
            });
        });

    }
}
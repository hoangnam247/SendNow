<x-mail::message>
# Introduction

{!! $campaignContent !!}  <!-- Hiển thị nội dung từ cột content trong campaigns -->

<img src="{{ $message->embed(public_path('images/cmnm.jpg')) }}" alt="Hình ảnh mẫu" width="300" height="auto">


<x-mail::button :url="''">
Campaigns Email

</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>

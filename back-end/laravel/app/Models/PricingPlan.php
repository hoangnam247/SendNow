<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    use HasFactory;

    // Đặt tên bảng tương ứng
    protected $table = 'pricing_plans';

    // Danh sách các thuộc tính mà bạn có thể gán giá trị
    protected $fillable = [
        'name',
        'price',
        'max_emails',
    ];

    // Nếu bạn có timestamps, có thể giữ lại hoặc xóa

}

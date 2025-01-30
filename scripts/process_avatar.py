#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from PIL import Image
import sys
from pathlib import Path

def create_directory(path):
    """创建目录（如果不存在）"""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"创建目录: {path}")

def process_image(input_path, output_path, size=(300, 300)):
    """处理图片：调整大小、裁剪为正方形、优化质量"""
    try:
        # 打开图片
        with Image.open(input_path) as img:
            # 转换为RGB模式（处理PNG等格式）
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 获取原始尺寸
            width, height = img.size
            
            # 计算裁剪区域（保持中心）
            if width > height:
                left = (width - height) // 2
                top = 0
                right = left + height
                bottom = height
            else:
                top = (height - width) // 2
                left = 0
                bottom = top + width
                right = width
            
            # 裁剪为正方形
            img = img.crop((left, top, right, bottom))
            
            # 调整大小
            img = img.resize(size, Image.Resampling.LANCZOS)
            
            # 保存图片，优化质量
            img.save(output_path, 'JPEG', quality=85, optimize=True)
            
            print(f"图片处理成功！保存至: {output_path}")
            print(f"新图片尺寸: {size[0]}x{size[1]}")
            
            # 获取文件大小
            file_size = os.path.getsize(output_path) / 1024  # 转换为KB
            print(f"文件大小: {file_size:.2f}KB")
            
    except Exception as e:
        print(f"处理图片时出错: {str(e)}")
        sys.exit(1)

def main():
    # 获取脚本所在目录
    script_dir = Path(__file__).parent.parent
    
    # 设置输入输出路径
    images_dir = script_dir / 'assets' / 'images'
    output_path = images_dir / 'avatar-placeholder.jpg'
    
    # 创建images目录
    create_directory(images_dir)
    
    # 检查命令行参数
    if len(sys.argv) != 2:
        print("使用方法: python process_avatar.py <输入图片路径>")
        print("示例: python process_avatar.py my_photo.jpg")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    # 检查输入文件是否存在
    if not os.path.exists(input_path):
        print(f"错误: 找不到输入文件 {input_path}")
        sys.exit(1)
    
    # 处理图片
    process_image(input_path, output_path)

if __name__ == "__main__":
    main() 
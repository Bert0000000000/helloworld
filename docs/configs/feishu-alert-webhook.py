#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
飞书告警通知 Webhook 服务
用于接收 Prometheus Alertmanager 告警并转发到飞书群

使用方式:
    python feishu-alert-webhook.py

环境变量:
    FEISHU_WEBHOOK_URL: 飞书机器人 Webhook URL
    FEISHU_P0_WEBHOOK_URL: P0 告警专用 Webhook URL (可选)
"""

import os
import json
import requests
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# 飞书 Webhook URL (从环境变量读取)
FEISHU_WEBHOOK_URL = os.getenv('FEISHU_WEBHOOK_URL', '')
FEISHU_P0_WEBHOOK_URL = os.getenv('FEISHU_P0_WEBHOOK_URL', '')


def send_feishu_message(webhook_url: str, message: dict) -> bool:
    """发送消息到飞书"""
    try:
        response = requests.post(
            webhook_url,
            json=message,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        return response.status_code == 200
    except Exception as e:
        print(f"发送飞书消息失败：{e}")
        return False


def format_alert_message(alerts: list) -> dict:
    """格式化告警消息为飞书卡片格式"""
    if not alerts:
        return {}
    
    # 获取最高级别
    severity_order = {'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3}
    max_severity = min(alerts, key=lambda x: severity_order.get(x.get('labels', {}).get('severity', 'P3'), 4))
    severity = max_severity.get('labels', {}).get('severity', 'P2')
    
    # 设置颜色和图标
    color_map = {
        'P0': ('#FF0000', '🔴'),  # 红色
        'P1': ('#FF6600', '🟠'),  # 橙色
        'P2': ('#FFCC00', '🟡'),  # 黄色
        'P3': ('#00CC00', '🟢')   # 绿色
    }
    color, icon = color_map.get(severity, ('#FFCC00', '🟡'))
    
    # 构建消息卡片
    cards = []
    for alert in alerts:
        labels = alert.get('labels', {})
        annotations = alert.get('annotations', {})
        
        card = {
            "tag": "section",
            "fields": [
                {
                    "is_short": True,
                    "text": {
                        "tag": "lark_md",
                        "content": f"**告警名称:**\n{labels.get('alertname', 'Unknown')}"
                    }
                },
                {
                    "is_short": True,
                    "text": {
                        "tag": "lark_md",
                        "content": f"**级别:** {severity}"
                    }
                },
                {
                    "is_short": True,
                    "text": {
                        "tag": "lark_md",
                        "content": f"**实例:**\n{labels.get('instance', 'N/A')}"
                    }
                },
                {
                    "is_short": True,
                    "text": {
                        "tag": "lark_md",
                        "content": f"**时间:**\n{alert.get('startsAt', 'N/A')}"
                    }
                }
            ]
        }
        cards.append(card)
        
        # 添加描述
        if annotations.get('description'):
            cards.append({
                "tag": "section",
                "text": {
                    "tag": "lark_md",
                    "content": f"**描述:** {annotations.get('description')}"
                }
            })
        
        # 添加运行手册链接
        if annotations.get('runbook_url'):
            cards.append({
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "📖 查看运行手册"
                        },
                        "url": annotations.get('runbook_url'),
                        "type": "primary"
                    }
                ]
            })
    
    # 构建完整消息
    message = {
        "msg_type": "interactive",
        "card": {
            "header": {
                "template": color.split('#')[1] if color.startswith('#') else 'yellow',
                "title": {
                    "tag": "plain_text",
                    "content": f"{icon} HelloWorld 监控告警 ({len(alerts)}条)"
                }
            },
            "config": {
                "wide_screen_mode": True
            },
            "elements": cards
        }
    }
    
    return message


@app.route('/webhook', methods=['POST'])
def webhook():
    """接收 Alertmanager 告警"""
    try:
        data = request.json
        alerts = data.get('alerts', [])
        
        if not alerts:
            return jsonify({'status': 'ok', 'message': 'no alerts'}), 200
        
        # 格式化消息
        message = format_alert_message(alerts)
        
        # 判断是否使用 P0 专用通道
        webhook_url = FEISHU_WEBHOOK_URL
        for alert in alerts:
            if alert.get('labels', {}).get('severity') == 'P0':
                webhook_url = FEISHU_P0_WEBHOOK_URL or FEISHU_WEBHOOK_URL
                break
        
        if not webhook_url:
            return jsonify({'status': 'error', 'message': 'webhook url not configured'}), 500
        
        # 发送消息
        success = send_feishu_message(webhook_url, message)
        
        if success:
            return jsonify({'status': 'ok', 'message': f'sent {len(alerts)} alerts'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'failed to send'}), 500
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({'status': 'healthy'}), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)

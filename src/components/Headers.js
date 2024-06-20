import {  Select, Button } from 'antd';
import { useEffect, useState} from 'react'
import { Modal, Space } from "antd";

export default function Headers({
     setSizeGenerateFutoshiki, sizeGenerateFutoshiki,
     setSolveFutoshiki, setRepeateFutoshiki, countHearts,
     levelComplexity, setLevelComplexity
    }) {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState([]);

    const levels = [
        { value: 0, label: 'Простой'},
        { value: 1, label: 'Средний'},
        { value: 2, label: 'Сложный'}
    ];

    useEffect(()=>{
        const itemsDropdown = [];
        for (let i = 4; i <= 9; i++) {
            itemsDropdown.push({
                value: i,
                label: i
            })
        };
        setItems(itemsDropdown);
    }, []);

    useEffect(()=>{
        if (countHearts === 0) {
            setIsModalOpen(true);
        }
        let content = [];
        for (let i = 0; i < countHearts; i++) {
            content.push(
                <img alt ="heart"  src='like.png' width="40" height="40" />
            )
        };
        setContent(content);
    }, [countHearts]);

    return (
        <header className="header">
            {   sizeGenerateFutoshiki === 0 || levelComplexity === -1 ?
                <div className='futoshiki_grid'>
                    <div> Сгенерировать головоломку "Футошики":</div>
                        <Select
                            placeholder="Выберите размер головоломки"
                            style={{
                                width: '100%', marginTop: 20
                            }}
                            onChange={(value) => {setSizeGenerateFutoshiki(value)}}
                            options={items}
                        />
                    
                        <Select
                            placeholder="Выберите сложность головоломки"
                            style={{
                                width: '100%', marginTop: 20
                            }}
                            onChange={(value) => {setLevelComplexity(value)}}
                            options={levels}
                        />
                </div> :
                <> <Button onClick={() => {setSolveFutoshiki(true)}}>Посмотреть решение</Button>
                <Button onClick={() => {setSizeGenerateFutoshiki(0); setLevelComplexity(-1); setSolveFutoshiki(false)}} style={{ marginLeft: 15 }}>
                    Сгенерировать новую головоломку</Button>
                    <Space wrap size={16} className='futoshiki_hearts' style={{
                            float: 'right', marginRight: '5%'
                        }}>
                        {content }
                    </Space>
                    <Modal title="Конец игры!" open={isModalOpen}
                    footer={[
                        <Button key="repeate" onClick={() => {setRepeateFutoshiki(true); setIsModalOpen(false);}}>Попробовать заново</Button>,
                        <Button key="generate" type="primary" onClick={() => {
                            setSizeGenerateFutoshiki(0); setSolveFutoshiki(false);
                            setIsModalOpen(false); setLevelComplexity(-1);
                        }}> Сгенерировать новую головоломку </Button>,
                      ]}>
                        <p>Жизни закончились</p>
                    </Modal>

                </>
            }
        </header>
    )
}